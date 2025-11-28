import models from "../models/index.js";
const { User, Category, Question, PracticeSession } = models;

import {marked} from 'marked';
import createDOMPurify from 'dompurify';
import {JSDOM} from 'jsdom';

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
      const questions = await Question.find({userId: req.user.id});
      const sessions = await PracticeSession.find({userId: req.user.id});
      return res.render('dashboard', {
        user,
        questions,
        sessions,
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
        $addToSet: {resources: resource},
      },{new:true});
      return res.status(201).json({message: 'your resource has been saved'})
    }catch(saveResourceError){
      console.log(saveResourceError);
      return res.status(400).json({message:saveResourceError.message});
    }
  },
  
  getSession: async(req,res) => {
    try{
      const {sessionId} = req.body;
      const session = await PracticeSession.findById(sessionId).populate('questions');
      const userQuestions = await Question.find({userId:req.user.id});
      const parentIds = new Set(userQuestions.map(q => q.parentId ? q.parentId.toString() : null).filter(Boolean));
      const questions = session.questions.map(q => {
        if (parentIds.has(q._id.toString())){
          const updated = userQuestions.find(uq => {
            return uq.parentId?.toString() === q._id.toString()
          })
          return updated;
        }
        return q;
      });
      const feedback = session.aiResponse ? session.aiResponse.questionResponse.map(res => {      
        const window = new JSDOM('').window;
        const pure = createDOMPurify(window);
        const purified = pure.sanitize(marked.parse(res.feedback, {breaks:true}));
        console.log({purified})
        return purified.replaceAll('\n', '<br>')
                       .replaceAll('&lt;', '<br>')
                       .replaceAll('&nbsp;', '<br>');
      }) : [];
      return res.render('previousSession', {
        session,
        questions,
        feedback
      })
    }catch(getSessionError){
      console.log({getSessionError});
      return res.status(400).json({message: getSessionError.message});
    }
  },

  deleteResource: async(req,res) =>{
    try{
      const {resource} = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: {resources: resource},
        },
        {new:true}
      )
      return res.status(200).json({message:"successfully removed resource"})
    }catch(deleteResourceError){
      console.log({deleteResourceError});
      return res.status(404).json({message: deleteResourceError.message})
    }
  },

  updateUser: async(req,res) => {
    try{
      const {title,level} = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            [`info.title`]: title,
            [`info.level`]: level,
          },
        },
        {new:true}
      );
      return res.status(200).json({message: "successfully updated user info"})
    }catch(updateUserError){
      console.log({updateUserError});
      return res.status(400).json({message: updateUserError.message});
    }
  },
};
