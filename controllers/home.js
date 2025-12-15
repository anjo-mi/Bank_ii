import models from "../models/index.js";
const { User, Category, Question, PracticeSession } = models;
import s3client from "../controllers/aws.js";

import {marked} from 'marked';
import createDOMPurify from 'dompurify';
import {JSDOM} from 'jsdom';

// good chance this will be encompassed elsewhere
export default {
  getHome: async (req, res) => {
    try{
      let defaultCategories = await Category.find({isDefault: true});
      if (req.session?.optOut) defaultCategories = defaultCategories.filter(c => !c.is100Devs);
      const userCategories = req.user?.id ? await Category.find({userId:req.user.id}) : null;
      const allCats = userCategories ? Array.from(new Set([...userCategories.map(c => c.description), ...defaultCategories.map(c => c.description)])) : defaultCategories.map(c => c.description);
      
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

        return purified.replaceAll('\n', '<br>')
                       .replaceAll('\\n', '<br>')
                       .replaceAll('-', '<br>')
                       .replaceAll('&lt;', '<br>')
                       .replaceAll('&gt;', '<br>')
                       .replaceAll('&nbsp;', '<br>')
                       .replaceAll(',,,', '<br><br><br>')
                       .replaceAll('###', '<br><br><br>');
      }) : [];
      const audioKeys = await Promise.all(
        session.audioKeys?.map(async key => key ? await s3client.getAudio(key) : key)
      );

      return res.render('previousSession', {
        session,
        questions,
        feedback,
        audioKeys,
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
      const {title,level,optOut} = req.body;
      console.log({title,level,optOut})
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            [`info.title`]: title,
            [`info.level`]: level,
            optOut : optOut || false,
          },
        },
        {new:true}
      );
      req.session.optOut = optOut;
      await req.session.save();
      return res.status(200).json({message: "successfully updated user info"})
    }catch(updateUserError){
      console.log({updateUserError});
      return res.status(400).json({message: updateUserError.message});
    }
  },
};
