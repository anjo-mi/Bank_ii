import models from "../models/index.js";
const { User, Category, Question } = models;

export default {
  // load practice setup page with all [pre-loaded] categories
  getCategories: async (req, res) => {
    const userCategories = await Category.find({userId:req.user.id});
    const defaultCategories = await Category.find({isDefault:true})
    const allCats = userCategories ? [...userCategories,...defaultCategories] : defaultCategories;
    res.render("practice", { allCats });
    // res.json({allCats})
  },

  // take any requested categories and desired interview length
  startPractice: async (req,res) => {
    let {categori, limit} = req.body;

    const defaultQuestions = await Question.find({isDefault:true});
    const userQuestions = await Question.find({userId: req.user.id});
    const questions = userQuestions ? [...userQuestions, ...defaultQuestions] : defaultQuestions;

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

    // function that takes an array and randomizes the order
    // + radomize all matching questions and slice(0,limit) to get at most the amount of requested questions
    const randomizeQuestions = (qArr) => {
      const qs = qArr.slice(0);
      let current = qArr.length;
      
      while (current){
        const random = Math.floor(Math.random() * current);
        current--;

        [ qs[current] , qs[random] ] = [ qs[random] , qs[current] ]
      }
      return qs;
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
    // res.json({
    //   questions: randomizedQuestions,
    //   current: -1,
    //   requestedLength: limit,
    //   sufficient,
    //   message,
    // })
  },

  // begins being called from breifing page (/startPractice)
  showNext: async (req,res) => {
    let {questions, current} = req.body;
    // pages are rendered, so parse JSON
    questions = JSON.parse(questions);
    // increment current index (passed from /startPractice, tracked to be less than questions length)
    current = +current + 1;

    // if this is from the /startPractice page, initialize an answers array, otherwise it equals itself (parsed)
    const answers = req.body.answers ? JSON.parse(req.body.answers) : [];
    const answer = req.body.answer;

    // if this is coming form the /practiceQuestion page, take then answer field and push it to the answers array
    if (answer || answer === '') answers.push(answer);

    // if all questions are answered, make a results object that binds questions to their answers
      // render the results page
    // otherwise call the current page with new data
    if (current === questions.length) {
      const results = {};
      for (let i = 0 ; i < questions.length ; i++){
        results['Question ' + (i+1)] = {
          question: questions[i].content,
          categories: questions[i].categories,
          answer: answers[i],
        }
      }
      res.render('practiceCompleted', {results});
    }
    else res.render('practiceQuestion', {questions,current,answers});
  }
};
