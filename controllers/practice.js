import models from "../models/index.js";
const { User, Category, Question } = models;

export default {
  getCategories: async (req, res) => {
    const allCats = await Category.find();
    console.log({req})
    res.render("practice", { allCats });
    // res.json({allCats})
  },

  startPractice: async (req,res) => {
    let {categori, limit} = req.body;
    const questions = await Question.find();
    const arab = new Set([0,1,2,3,4,5,6,7,8,9,]);
    limit = limit 
            && limit > 0
            && limit.toString().split('').map(Number).every(dig => arab.has(dig)) 
                ? Math.floor(limit)
                : 7;

    // poor time complexity, but both variables should theoretically be small
    //    (categories per question, categories included in an interview)
    const matchingQuestions = categori && categori.length 
          ? questions.filter(q => q.categories.some(cat => categori.includes(cat)))
          : questions;

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

    const sufficient = randomizedQuestions.length === limit;
    const message = sufficient
                    ? null
                    : `Your search yielded ${randomizedQuestions.length} results, while the interview was intended to contain ${limit} questions. Would you like to proceed?`;
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

  showNext: async (req,res) => {
    let {questions, current} = req.body;
    questions = JSON.parse(questions);
    current = +current + 1;

    const answers = req.body.answers ? JSON.parse(req.body.answers) : [];
    const answer = req.body.answer;

    if (answer || answer === '') answers.push(answer);
    console.log({answer,answers})    
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
