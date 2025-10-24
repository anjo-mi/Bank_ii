import models from "../models/index.js";
const { User, Category, Question, PracticeSession } = models;

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

  getUserDash: async (req,res) => {
    try{
      const user = await User.findById(req.user.id);
      const userQuestions = await Question.find({userId: req.user.id});
      const userSessions = await PracticeSession.find({userId: req.user.id});
      return res.render('dashboard', {
        user,
        userQuestions,
        userSessions,
      });
    }catch(getUserDashError){
      console.log({getUserDashError});
      return res.status(400).json({message:getUserDashError.message});
    }
  },

  saveResource: async (req,res) => {
    try{
      const {resource} = req.body;
      const user = await User.findByIdAndUpdate(req.user.id,{
        $push: {resources: resource},
      },{new:true});
      return res.status(201).json({message: 'your resource has been saved'})
    }catch(saveResourceError){
      console.log(saveResourceError);
      return res.status(400).json({message:saveResourceError.message});
    }
  }
};
