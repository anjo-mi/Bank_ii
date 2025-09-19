import models from "../models/index.js";
const { User, Category, Question } = models;

export default {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      // console.log({ categories });
      setTimeout(() => {
        console.log("you gota wait");
        return res.json({ categories });
      }, 5000);
    } catch (e) {
      console.log({ e });
      res.status(400).send("at this point, its prolly a server error");
    }
  },
};
