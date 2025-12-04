import mongoose from "mongoose";
import models from "../models/index.js";
const { User, Category, Question, PracticeSession } = models;
import agent from "../services/aiService.js";

export default {

  getAllQuestions: async (req, res) => {
    try {
      let defaultQuestions = await Question.find({isDefault: true});
      let userQuestions;
      if (req.user) {
        userQuestions = await Question.find({userId: req.user.id});
        const ignoredIds = new Set(userQuestions.map(q => q.parentId).filter(Boolean).map(String));
        defaultQuestions = defaultQuestions.filter(q => !ignoredIds.has(q._id.toString()));
      }

      const allQuestions = userQuestions ? [...userQuestions,...defaultQuestions] : defaultQuestions;

      // set incomingSearch to nothing so EJS doesnt complain
      res.render("questions", { allQuestions, incomingSearch:'' });

    } catch (getQuestionsError) {
      console.log({ getQuestionsError });
      res.status(500).send("database error");
    }
  },

  // obvious
  getQuestionById: async (req, res) => {
    try {
      const question = await Question.findById(req.body.id);

      if (question) res.render("singleQuestion", { question });
      // if (question) return res.json(question);
      else return res.status(404).send("that question does not exist in the database!");
    } catch (searchByIdError) {
      console.log({ searchByIdError });
      res.status(500).json({message: searchByIdError.message});
    }
  },

  // EJS is needy af, make sure to send req.body.incomingSearch in ALL cases
  getQuestionsByCats: async (req, res) => {
    try {
      let defaultQuestions = await Question.find({isDefault:true});
      let userQuestions;
      if (req.user) {
        userQuestions = await Question.find({userId:req.user.id});
        const ignoredIds = new Set(userQuestions.map(q => q.parentId).filter(Boolean).map(String));
        defaultQuestions = defaultQuestions.filter(q => !ignoredIds.has(q._id.toString()));
      }
      
      const allQuestions = userQuestions ? [...userQuestions,...defaultQuestions] : defaultQuestions;
      
      const body = req.body;

      // if matchAll isnt selected, assume its match any
      const matchAll = body.matchAll ? Boolean(+body.matchAll) : false;
      
      // convert any requests in the body to a Set, determine if there are any
      // if theres only one category requested, make it an array of 1
      const cats = Array.isArray(body.categori) ? body.categori : [body.categori];
      const categori = new Set(cats);

      if (!matchAll){
        // if there are no categories requested, respond with all questions,
          // otherwise extract all questions that contain ANY requested categories
        const requested = body.categori && categori.size
          ? allQuestions.filter((question) =>{
              return question.categories.some((cat) => categori.has(cat))
            })
          : allQuestions;
        res.render("questions", {
          allQuestions: requested,
          incomingSearch: req.body.search,
        });
        // return res.json( { allQuestions: requested } );
      }else{
        // if user wants only questions with exact matches for requested categories

        const requested = allQuestions.filter((question) => {    
          // question.categories should theoretically never get out of control in terms of length
          // O(n^2) seems <'er of two evils in comparison to being needlessly complex
          return cats.every((cat) => question.categories.includes(cat));

        });
        // in the case that matchAll is selected, but no categories were selected
          // run matchAll using any search parameters
          // (ie all searched words must appear in question content to be shown)
        const search = req.body.search 
              ? req.body.search.split(' ').map(word => word.toLowerCase().trim())
              : '';
        let searchRequest = null;
        if (!requested.length && search.length){
          searchRequest = allQuestions.filter((question) => {
            return search.every(word => question.content.toLowerCase().includes(word));
          })
        }
        res.render("questions", {
          allQuestions: searchRequest ? searchRequest : requested,
          incomingSearch: req.body.search,
        });
        // return res.json( { allQuestions: requested } );
      }
    } catch (searchByCategoryError) {
      console.log({ searchByCategoryError });
      res.status(500).json({message: searchByCategoryError.message});
    }
  },

  getRandomQuestion: async (req,res) => {
    try{
      let {
        matchAll, // 0 for MatchAny, 1 for MatchAll
        search, // ' ' separated String || undefined
        categori, // undefined || String || [Strings]
      } = req.body;

      let defaultQuestions = await Question.find({isDefault: true});
      let userQuestions;
      if (req.user) {
        userQuestions = await Question.find({userId: req.user.id});
        const ignoredIds = new Set(userQuestions.map(q => q.parentId).filter(Boolean).map(String));
        defaultQuestions = defaultQuestions.filter(q => !ignoredIds.has(q._id.toString()));
      }
      const allQuestions = userQuestions ? [...userQuestions,...defaultQuestions] : defaultQuestions;
      
      if ((!search || !search.trim()) && !categori) {
        const random = Math.floor(Math.random() * allQuestions.length);
        return res.render('singleQuestion', {
          question: allQuestions[random],
        })
      }

      matchAll = matchAll ? Boolean(+matchAll) : false;
      categori = Array.isArray(categori) ? categori : [categori];
      categori = new Set(categori.filter(Boolean));
      search = search ? search.trim().split(' ').map(word => word.trim().toLowerCase()) : [];

      let questions;
      if (matchAll){
        questions = allQuestions.filter(q =>{
          let searchMatch = true;
          let categoryMatch = true;
          if (categori.size){
            // categoryMatch = q.categories.every(cat => categori.has(cat));
            categoryMatch = Array.from(categori).every(cat => q.categories.includes(cat));
          }
          if (search.length){
            searchMatch = search.every(word => q.content.toLowerCase().includes(word));
          }
          return searchMatch && categoryMatch;
        });
      }else{
        questions = allQuestions.filter(q =>{
          let searchMatch = true;
          let categoryMatch = true;
          if (categori.size){
            categoryMatch = q.categories.some(cat => categori.has(cat));
          }
          if (search.length){
            searchMatch = search.every(word => q.content.toLowerCase().includes(word));
          }
          return searchMatch && categoryMatch;
        });
      }
      if (!questions || !questions.length){
        return res.status(400).json({message: 'no questions matched your search'})
      }
      const random = Math.floor(Math.random() * questions.length);
      const question = questions[random];
      return res.render('singleQuestion', {
        question,
      })

    }catch(getRandomQuestionError){
      console.log({getRandomQuestionError});
      return res.status(500).json({message: 'there was en error while retrieving the question'});
    }
  },

  getNewQuestionForm: async (req,res) => {
    try{
      const userCategories = await Category.find({userId: req.user.id});
      const defaultCategories = await Category.find({isDefault: true});
      const categori = Array.from(new Set(userCategories.concat(defaultCategories)));
      res.render('addQuestion', {categori})
    }catch(getNewQuestionFormError){
      console.log({getNewQuestionFormError});
      return res.status(400).json({message:getNewQuestionFormError.message});
    }
  },

  createNewQuestion: async (req,res) => {
    try{
      let {
        question,
        categori,
        answer,
        newCategories,
      } = req.body;
      if (!categori) return res.status(400).json({message: "questions each need at least 1 category"});
      if (!question.trim().length) return res.status(400).json({message: "questions need content"});
      categori = Array.isArray(categori) ? categori : [categori];

      const cs = [];
      if (newCategories && newCategories.trim().length){
        newCategories = newCategories.trim().split('VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULT').slice(1);
        newCategories = new Set(newCategories);
        for (const cat of categori) if (newCategories.has(cat)){
          const c = await Category.create({
            description: cat,
            userId: req.user.id,
            isDefault: false,
          })
          if (!c) res.json({message:`${cat} was not added to the database`})
          else cs.push(c);
        }
      }

      const quest = await Question.create({
        categories: categori,
        userId: req.user.id,
        content: question,
        answer: answer || null,
        isDefault: false,
      })
      if (!quest) return res.status(500).json({message:`question was not added to the database`})
      // return res.status(201).json({quest,cs});
      // return res.render('addQuestion').json({message:"question successfully uploaded"});
      return res.status(200).json({message:'question successfully added!'});
    }catch(questionCreationError){
      console.log({questionCreationError});
      res.status(500).json({message: "server error when creating question"});
    }
  },

  getEditSearchPage: async (req,res) => {
    try{

      let defaultQuestions = await Question.find({isDefault: true});
      const userQuestions = await Question.find({userId: req.user.id});
      const ignoredIds = new Set(userQuestions.map(q => q.parentId).filter(Boolean).map(String));
      defaultQuestions = defaultQuestions.filter(q => !ignoredIds.has(q._id.toString()));
      const allQuestions = Array.from(new Set([...userQuestions,...defaultQuestions]));
      
      if (!allQuestions.length) return res.redirect('/questions/form');
      
      const defaultCategories = await Category.find({isDefault: true});
      const userCategories = await Category.find({userId: req.user.id});
      
      const allCategories = userCategories ? Array.from(new Set([...userCategories, ...defaultCategories])) : defaultCategories;

      return res.render('editSearch', {
        allCats: allCategories,
        allQuestions,
      })
    }catch(getEditSearchError){
      console.log({getEditSearchError});
      return res.status(400).json({message:"error retrieving user questions"})
    }
  },

  getEditQuestionPage: async(req,res) => {
    try{
      const {questionId} = req.body;
      const user = await User.findById(req.user.id);
      const question = await Question.findById(questionId);
      if (question.userId && question.userId.toString() !== req.user.id) return res.status(403).json({message: "this question isnt yours to change"});
      res.render('editQuestion', {
      question,
      categori: question.categories || [],
      })
    }catch(getEditQuestionError){
      console.log(getEditQuestionError)
      return res.status(500).json({message: getEditQuestionError.message});
    }
  },

  answerQuestion: async (req,res) => {
    try{
      const audio = req.file;
      const body = req.body;
      console.log( "xxxxxxxxxxxxxxxxxxxxxxxxxxx", {audio,body})
      let {answer,questionId,question} = req.body;
      const singleQuestionSession = await PracticeSession.create({
        userId: req.user.id,
        questions: [questionId],
        answers: [answer],
      });
      console.log({question})
      question = audio ? JSON.parse(question).question : question;
      console.log({question})
      const sessionId = singleQuestionSession._id;
      // const questions = singleQuestionSession.questions;
      const user = await User.findById(req.user.id);
      const level = user?.info?.level;
      const title = user?.info?.title;
      agent.getAnswerFeedback(question, answer, 0, sessionId, level,title);
      req.session.practiceId = {sessionId};
      await req.session.save();
      return res.status(201).json({sessionId});
    }catch(answerQuestionError){
      console.log({answerQuestionError});
      return res.status(400).json({message: answerQuestionError.message});
    }
  },

  updateQuestion: async(req,res) => {
    try{
      const body = req.body;
      let {
        categori,
        answer,
        question,
        questionId,
        newCategories,
      } = req.body;
      if (!categori || !categori.length) return res.status(404).json({message:"questions each need at least 1 category"});
      if (!question.trim().length) return res.status(404).json({message:"questions need content"});
      const categories = Array.isArray(categori) ? categori : [categori];

      const cs = [];
      if (newCategories && newCategories.trim().length){
        newCategories = newCategories.trim().split('VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULT').slice(1);
        newCategories = new Set(newCategories);
        for (const cat of categori) if (newCategories.has(cat)){
          const c = await Category.create({
            description: cat,
            userId: req.user.id,
            isDefault: false,
          })
          if (!c) res.json({message:`${cat} was not added to the database`})
          else cs.push(c);
        }
      }
      const quest = await Question.findById(questionId);
      if (quest.userId && quest.userId.toString() !== req.user.id) return res.status(403).json({message: "congratulations, you worked some magic and got access to someone elses question, but you cant change it that easily"});

      if (!quest.isDefault){
        const updatedQuestion = await Question.findByIdAndUpdate(
          questionId,
          {$set:{
            content: question,
            userId: req.user.id,
            categories,
            answer: answer || null,
          }},
          {new:true}
        );
      }else{
        const reUpdatedDefault = await Question.findOneAndUpdate(
          {
            userId: req.user.id,
            parentId: questionId,
          },
          {$set:{
            content: question,
            userId: req.user.id,
            categories,
            answer: answer || null,
          }},
          {new:true}
        )
        let noLongerDefaultQuestion;
        if (!reUpdatedDefault){
          noLongerDefaultQuestion = await Question.create({
            userId: req.user.id,
            content: question,
            categories,
            answer,
            isDefault: false,
            parentId: quest._id,
          })
        }
      }
      return res.status(201).json({message: 'question updated!'})
    }catch(updateQuestionError){
      console.log({updateQuestionError});
      return res.status(500).json({message: updateQuestionError.message});
    }
  },

  saveAnswer: async(req,res) => {
    try{
      const {
        answer,
        content,
        questionId,
        isDefault,
      } = req.body;
      const q = await Question.findById(questionId);
      if (!q.isDefault){
        const updatedQuestion = await Question.findByIdAndUpdate(
          questionId , {answer} , {new:true}
        );
        return res.status(201).json({message: `your answer to ${updatedQuestion.content} has been updated`});
      }else{
        const reUpdatedDefault = await Question.findOneAndUpdate(
          {
            userId: req.user.id,
            parentId: questionId,
          },
          {answer},
          {new:true}
        )
        let noLongerDefaultQuestion;
        if (!reUpdatedDefault){
          noLongerDefaultQuestion = await Question.create({
            userId: req.user.id,
            content,
            answer,
            categories: q.categories,
            isDefault: false,
            parentId: q._id,
          })
        }
        return res.status(201).json({message: `your answer to ${reUpdatedDefault ? reUpdatedDefault.content : noLongerDefaultQuestion.content} has been updated`});
      }
    }catch(saveAnswerError){
      console.log(saveAnswerError);
      return res.status(400).json({message: saveAnswerError.message});
    }
  },

  saveFeedback: async(req,res) => {
    try{
      const {
        answer,
        content,
        questionId,
        feedback,
      } = req.body;
      const q = await Question.findById(questionId);
      if (!q.isDefault){
        const updatedQuestion = await Question.findByIdAndUpdate(
          questionId , {feedback} , {new:true}
        );
        return res.status(201).json({message: `your feedback for "${updatedQuestion.content}" has been updated`});
      }else{
        const reUpdatedDefault = await Question.findOneAndUpdate(
          {
            userId: req.user.id,
            parentId: questionId,
          },
          {feedback},
          {new:true}
        )
        let noLongerDefaultQuestion;
        if (!reUpdatedDefault){
          noLongerDefaultQuestion = await Question.create({
            userId: req.user.id,
            content,
            answer,
            feedback,
            categories: q.categories,
            isDefault: false,
            parentId: q._id,
          })
        }
        return res.status(201).json({message: `your feedback for "${reUpdatedDefault ? reUpdatedDefault.content : noLongerDefaultQuestion.content}" has been updated`});
      }
    }catch(saveAnswerError){
      console.log(saveAnswerError);
      return res.status(400).json({message: saveAnswerError.message});
    }
  },

  deleteQuestion: async (req,res) => {
    try{
      const questionId = req.params.id;
      // make sure question exists and is the user's
      const checkQuestion = await Question.findById(questionId);
      if (!checkQuestion) return res.status(500).json({message:'failed to locate question'});
      if (checkQuestion.userId.toString() !== req.user.id) return res.status(403).json({message:'tsk tsk, this is not yours to remove'});

      // delete the question, but extract the categories
      const deletedQuestion = await Question.findByIdAndDelete(questionId);
      const {categories} = deletedQuestion;

      // make sure the categories can find at least one question, otherwise delete the category
      for (const category of categories){
        const questionsInCategory = await Question.find({
          userId: req.user.id,
          categories: {$in: [category]},
        })
        if (!questionsInCategory.length) {
          const removedCategory = await Category.deleteOne({
            description: category,
            userId: req.user.id
          });
        }
      }
      // if ( req.get('referer').endsWith('/select')){
        return res.status(200).json({message: 'question has been removed from the database'});
      // }
      // return res.redirect('/questions/edit/select');
    }catch(deleteQuestionError){
      console.log({deleteQuestionError})
      return res.status(500).json({message: deleteQuestionError.message});
    }
  },
};
