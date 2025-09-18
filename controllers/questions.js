import models from "../models/index.js";
const { User, Caetgory, Question } = models;

export default {
  getAllQuestions: async (req, res) => {
    try {
      const allQuestions = await Question.find();
      // console.log({ questions });
      res.render("questions", { allQuestions });
    } catch (e) {
      console.log({ e });
      res.status(400).send("at this point, its prolly a server error");
    }
  },
  getQuestionById: async (req, res) => {
    try {
      const question = await Question.findById(req.body.id);

      if (question) res.render("singleQuestion", { question });
      // if (question) return res.json(question);
      else return res.status(404).send("that question does not exist in the database!");
    } catch (e) {
      console.log({ e });
      res.status(404).send("question not found!");
    }
  },
  getQuestionsByCats: async (req, res) => {
    try {
      const allQuestions = await Question.find();
      const body = req.body;

      // if matchAll isnt selected, assume its match any
      const matchAll = body.matchAll ? Boolean(+body.matchAll) : false;
      
      // convert any requests in the body to a Set, determine if there are any
      const cats = Array.isArray(body.categori) ? body.categori : [body.categori];
      const categori = new Set(cats);

      if (!matchAll){
        // if there are no categories requested, respond with all questions,
          // otherwise extract all questions that contain ANY requested categories
          // maybe switch to "half strict"?
            // ???"some" -> "every" (single category will ones will pop up with exact matches)???
        const requested = categori.size
          ? allQuestions.filter((question) =>{
              return question.categories.some((cat) => categori.has(cat))
            })
          : allQuestions;
        // res.render("questions", { allQuestions: requested });
        return res.json( { allQuestions: requested } );
      }else{
        // if user wants only questions with exact matches for requested categories
        
        const requested = allQuestions.filter((question) => {
          
          // if theres only one category requested, make it an array of 1
          
          // question.categories should theoretically never get out of control in terms of length
          // O(n^2) seems <'er of two evils in comparison to being needlessly complex
          return cats.every((cat) => question.categories.includes(cat));

        });
        // res.render("questions", { allQuestions: requested });
        return res.json( { allQuestions: requested } );
      }
    } catch (e) {
      console.log({ e });
    }
  },
};
