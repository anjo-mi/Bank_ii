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

      console.log({ question });

      // question successfully loaded, need to render singleQuestion.ejs with the question's info
      if (question) return res.json(question);
      else return res.status(404).send("that question does not exist in the database!");
      // return res.render("singleQuestion", { question });
    } catch (e) {
      console.log({ e });
      res.status(404).send("question not found!");
    }
  },
  getQuestionsByCats: async (req, res) => {
    try {
      const allQuestions = await Question.find();
      const query = req.query;
      const requested = Array.from(query).length
        ? allQuestions.filter((question) =>
            question.categories.some((cat) => cat in query)
          )
        : allQuestions;
      console.log({ requested, query });
      res.render("questions", { allQuestions: requested });
    } catch (e) {
      console.log({ e });
    }
  },
};
