import models from "../models/index.js";
const { User, Category, Question } = models;

export default {
  getCategories: async (req, res) => {
    const allCats = await Category.find();
    // res.render("practice", { allCats });
    res.json({
      allCats
    })
  },

  startPractice: async (req,res) => {
    let {categori, limit} = req.body;
    const questions = await Question.find();
    limit = limit && limit > 0 ? limit : 7;

    // poor time complexity, but both variables should theoretically be small
    //    (categories per question, categories included in an interview)
    const matchingQuestions = categori.length 
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

    res.json({
      questions: randomizedQuestions,
      current: -1,
      requestedLength: limit,
      sufficient,
      message,
    })
  }
};
