import agent from "../services/aiService.js";
import models from "../models/index.js";
const { User, Category, Question, PracticeSession } = models;
import s3client from "../controllers/aws.js";
import aiLimiter from "../middleware/limiter-ai.js";

import {marked} from 'marked';
import createDOMPurify from 'dompurify';
import {JSDOM} from 'jsdom';

export default {
  // load practice setup page with all [pre-loaded] categories
  getCategories: async (req, res) => {
    const userCategories = await Category.find({userId:req.user.id});
    const defaultCategories = await Category.find({isDefault:true});
    const allCats = userCategories ? Array.from(new Set([...userCategories,...defaultCategories])) : defaultCategories;
    res.render("practice", { allCats });
    // res.json({allCats})
  },

  // take any requested categories and desired interview length
  startPractice: async (req,res) => {
    try{
      let {categori, limit} = req.body;
      categori = categori && !Array.isArray(categori) ? [categori] : categori;

      let defaultQuestions = await Question.find({isDefault:true});
      const userQuestions = await Question.find({userId: req.user.id});
      const ignoredIds = new Set(userQuestions.map(q => q.parentId).filter(Boolean).map(String));
      const questions = userQuestions ? [...userQuestions, ...defaultQuestions.filter(q => !ignoredIds.has(q._id.toString()))] : defaultQuestions;
      
      // if the length provided is a valid number, use that number, otherwise default is 7
      const arab = new Set([0,1,2,3,4,5,6,7,8,9,]);
      limit = limit 
              && limit > 0
              && limit.toString().split('').map(Number).every(dig => arab.has(dig)) 
                  ? Math.floor(limit)
                  : 7;

      // poor time complexity, but both variables should theoretically be small
      //    (categories per question, categories included in an interview)
      // ultimately, retrieve all questions
        // if categori's were supplied (came from /practice page), we only want questions that habe those categories
        // if no categori's were provided, all questions may be picked from
      const matchingQuestions = categori && categori.length 
            ? questions.filter(q => q.categories.some(cat => categori.includes(cat)))
            : questions;
      if (!matchingQuestions.length) return res.status(403).json({message: 'no questions match your search?'});
      // function that takes an array and randomizes the order
      // + radomize all matching questions and to get at most the amount of requested questions
      const randomizeQuestions = (qArr) => {
        const qs = qArr.slice(0);
        const randoms = new Set();

        while (qs.length && randoms.size < limit){
          const random = Math.floor(Math.random() * qs.length);
          const q = qs.splice(random,1)[0];
          if (randoms.has(q)) continue;
          randoms.add(q);
        }
        return Array.from(randoms);
      }
      const randomizedQuestions = randomizeQuestions(matchingQuestions).slice(0,limit);

      // determine if there were enough questions available to meet requested amount
      // provide message if not sufficient
      const sufficient = randomizedQuestions.length === limit;
      const message = sufficient
                      ? null
                      : `Your search yielded ${randomizedQuestions.length} results, while the interview was intended to contain ${limit} questions. Would you like to proceed?`;
      // send the user to the briefing page
      // index at -1, so each next call works for the length of the array
        // (first next() -> 0, listens for it to equal arr length and abort)
      res.render('startPractice', {
        questions: randomizedQuestions,
        current: -1,
        requestedLength: limit,
        sufficient,
        message,
      })
      
    }catch(startPracticeError){
      console.log({startPracticeError});
      return res.status(400).json({message: startPracticeError.message});
    }
  },

  // begins being called from breifing page (/startPractice)
  showNext: async (req,res) => {
    try{
      const audio = req.file;
      const body = req.body;
      let {questions, current, sessionId} = req.body;
      
      // pages are rendered, so parse JSON
      // if this is from the /startPractice page, initialize an answers array, otherwise it equals itself (parsed)
      const answers = req.body.answers && req.body.answers.length ? JSON.parse(req.body.answers) : [];
      const answer = req.body.answer;
      questions = audio || current < 0 ? JSON.parse(questions) : questions;

      const session = +current < 0 ? await PracticeSession.create({
        userId: req.user.id,
        questions,
        answers,
        audioKeys: [],
      }) : null;
      
      sessionId = session ? 
                    session._id : 
                  sessionId ?
                    sessionId : null;

      let updatedSession;
      if (current >= 0 && current < questions.length){
        // if this is coming form the /practiceQuestion page, take then answer field and push it to the answers array
        answers.push(answer || '');
        const key = audio ? `${questions[current]._id.toString()}/${req.user.id}.webm` : '';
        updatedSession = await PracticeSession.findByIdAndUpdate(
          sessionId,
          {
            $set: {
              [`answers.${current}`]: answer || '',
              [`audioKeys.${current}`]: key,
            },
          },
          {new: true},
        )
        const user = await User.findById(req.user.id);
        const level = user?.info?.level;
        const title = user?.info?.title;

        const userHasTokens = await aiLimiter.limitAI(current,req.user.id,sessionId,questions[current]);
        if (userHasTokens) agent.getAnswerFeedback(questions[current], answer, current, sessionId, level,title,req.user.id);

        if (audio){
          const audioStoreResponse = await s3client.storeAudio({key,audio});
        }
      }

      // increment current index (passed from /startPractice, tracked to be less than questions length)
      current = answers.length;

      // if this is the last question, store the practiceId to the session (getLoadResults / load results will use this to check session status)
      if (current === questions.length){
        req.session.practiceId = {sessionId};
        await req.session.save();
      }

      // render the practice question page if its the start of the session
      if (!current) res.render('practiceQuestion', {questions,current,answers,sessionId: sessionId ? sessionId.toString() : null});

      // otherwise send the json data to update to the next question
      if (current) return res.status(200).json({
        questions,
        current,
        answers,
        sessionId: sessionId ? sessionId.toString() : null
      })
    }catch(showNextError){
      console.log({showNextError});
      return res.status(400).json({message: showNextError.message});
    }
  },

  getSessions: async (req,res) => {
    try{
      const sessions = await PracticeSession.find({userId: req.user.id}).populate('questions');
      res.render('sessionHistory', {
        sessions,
      });
    }catch(getPracticeSessionsError){
      console.log({getPracticeSessionsError});
      return res.status(400).json({message: getPracticeSessionsError.message});
    }
  },

  checkSession: async (req,res) => {
    try{
      const sessionId = req.body.sessionId;
      const updatedSession = await PracticeSession.findById(sessionId).populate('questions');
      
      if (updatedSession.questions.length !== updatedSession.aiResponse.questionResponse?.reduce(a => a + 1, 0)) return res.status(206).json({message:'still cooking'});

      return res.status(201).json({sessionId});
    }catch(checkSessionError){
      console.log({checkSessionError});
      return res.status(400).json({message: checkSessionError.message});
    }
  },

  getResults: async (req,res) => {
    try{
      const sessionId = req.params.id;
      const updatedSession = await PracticeSession.findById(sessionId).populate('questions');
      
      if (updatedSession.questions.length !== updatedSession.aiResponse.questionResponse?.reduce(a => a + 1 ,0)) return res.status(500).json({message: 'the ai didnt catch up, were sorry'});

      const questions = updatedSession.questions;
      const feedback = updatedSession.aiResponse.questionResponse.map(res => {
        const window = new JSDOM('').window;
        const pure = createDOMPurify(window);
        const purified = pure.sanitize(marked.parse(res.feedback, {breaks:true}));
        return purified.replaceAll('\n', '<br>')
                       .replaceAll('\\n', '<br>')
                       .replaceAll('-', '<br>')
                       .replaceAll('&lt;', '<br>')
                       .replaceAll('&gt;', '<br>')
                       .replaceAll('&nbsp;', '<br>')
                       .replaceAll(',,,', '<br><br><br>')
                       .replaceAll('###', '<br><br><br>');
      })
      const audioKeys = await Promise.all(
        updatedSession.audioKeys?.map(async key => key ? await s3client.getAudio(key) : key)
      );
      res.render('practiceCompleted', {questions,updatedSession,feedback, audioKeys})
    }catch(getResultsError){
      console.log({getResultsError});
      return res.status(400).json({message: getResultsError.message});
    }
  },

  getLoadResults: async(req,res) => {
    try{
      const {sessionId} = req.session.practiceId;
      delete req.session.practiceId;
      res.render('loadResults', {sessionId})
    }catch(getLoadResultsError){
      console.log({getLoadResultsError});
      return res.status(400).json({message: getLoadResultsError.message});
    }
  },

  deleteSession: async(req,res) => {
    try{
      const {id} = req.body;
      const deletedSession = await PracticeSession.findByIdAndDelete(id);
      return res.status(200).json({message: "Session Deleted"})
    }catch(deleteSessionError){
      console.log({deleteSessionError});
      return res.status(400).json({message: deleteSessionError.message});
    }
  },
};
