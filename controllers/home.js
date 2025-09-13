import models from "../models/index.js";
const { User, Category, Question } = models;

export default {
  getHome: async (req, res) => {
    // retrieve info from database
    const allCats = await Category.find();
    console.log({ allCats });
    // render "index", {use retrieved data as props:vals}
    // use those props for implanting data in index.ejs
    res.render("index", { allCats });
  },
};
