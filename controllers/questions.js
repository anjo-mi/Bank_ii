import models from "../models/index.js";
const { User, Caetgory, Question } = models;

export default {
  getAllQuestions: async (req, res) => {
    try {
      const questions = await Question.find({});
      // console.log({ questions });
      return res.json({ questions });
    } catch (e) {
      console.log({ e });
      res.status(400).send("at this point, its prolly a server error");
    }
  },
  getQuestionById: async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);
      return res.json({ question });
    } catch (e) {
      console.log({ e });
      res.status(400).send("at this point, its prolly a server error");
    }
  },
};
