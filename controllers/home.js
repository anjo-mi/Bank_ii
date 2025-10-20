import models from "../models/index.js";
const { User, Category, Question } = models;

// good chance this will be encompassed elsewhere
export default {
  getHome: async (req, res) => {
    try{
      const defaultCategories = await Category.find({isDefault: true});
      const userCategories = req.user?.id ? await Category.find({userId:req.user.id}) : null;
      const allCats = userCategories ? [...userCategories, ...defaultCategories] : defaultCategories;
      
      res.render("index", { allCats });
    }catch(getIndexPageError){
      console.log({getIndexPageError});
      res.status(500).json({message:getIndexPageError.message});
    }
  },
};
