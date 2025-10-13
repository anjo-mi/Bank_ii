import models from "../models/index.js";
const { User, Category, Question } = models;

// good chance this will be removed
export default {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      return res.json({ categories });
    } catch (e) {
      res.status(400).send("at this point, its prolly a server error");
    }
  },
};
