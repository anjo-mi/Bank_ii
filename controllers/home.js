import models from "../models/index.js";
const { User, Category, Question } = models;

// good chance this will be encompassed elsewhere
export default {
  getHome: async (req, res) => {
    const allCats = await Category.find();
    res.render("index", { allCats });
  },
};
