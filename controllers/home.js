import models from "../models/index.js";
const { User, Category, Question } = models;

export default {
  getHome: async (req, res) => {
    const allCats = await Category.find();
    // console.log({ allCats });
    res.render("index", { allCats });
  },
};
