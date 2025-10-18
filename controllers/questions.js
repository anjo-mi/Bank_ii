import mongoose from "mongoose";
import models from "../models/index.js";
const { User, Category, Question } = models;

export default {

  getAllQuestions: async (req, res) => {
    try {
      const allQuestions = await Question.find();

      // set incomingSearch to nothing so EJS doesnt complain
      res.render("questions", { allQuestions, incomingSearch:'' });

    } catch (e) {
      console.log({ e });
      res.status(400).send("at this point, its prolly a server error");
    }
  },

  // obvious
  getQuestionById: async (req, res) => {
    try {
      const question = await Question.findById(req.body.id);

      if (question) res.render("singleQuestion", { question });
      // if (question) return res.json(question);
      else return res.status(404).send("that question does not exist in the database!");
    } catch (e) {
      console.log({ e });
      res.status(404).send("question not found!");
    }
  },

  // EJS is needy af, make sure to send req.body.incomingSearch in ALL cases
  getQuestionsByCats: async (req, res) => {
    try {
      const allQuestions = await Question.find();
      const body = req.body;

      // if matchAll isnt selected, assume its match any
      const matchAll = body.matchAll ? Boolean(+body.matchAll) : false;
      
      // convert any requests in the body to a Set, determine if there are any
      // if theres only one category requested, make it an array of 1
      const cats = Array.isArray(body.categori) ? body.categori : [body.categori];
      const categori = new Set(cats);

      if (!matchAll){
        // if there are no categories requested, respond with all questions,
          // otherwise extract all questions that contain ANY requested categories
        const requested = body.categori && categori.size
          ? allQuestions.filter((question) =>{
              return question.categories.some((cat) => categori.has(cat))
            })
          : allQuestions;
        res.render("questions", {
          allQuestions: requested,
          incomingSearch: req.body.search,
        });
        // return res.json( { allQuestions: requested } );
      }else{
        // if user wants only questions with exact matches for requested categories

        const requested = allQuestions.filter((question) => {    
          // question.categories should theoretically never get out of control in terms of length
          // O(n^2) seems <'er of two evils in comparison to being needlessly complex
          return cats.every((cat) => question.categories.includes(cat));

        });
        // in the case that matchAll is selected, but no categories were selected
          // run matchAll using any search parameters
          // (ie all searched words must appear in question content to be shown)
        const search = req.body.search 
              ? req.body.search.split(' ').map(word => word.toLowerCase().trim())
              : '';
        let searchRequest = null;
        if (!requested.length && search.length){
          searchRequest = allQuestions.filter((question) => {
            return search.every(word => question.content.toLowerCase().includes(word));
          })
        }
        res.render("questions", {
          allQuestions: searchRequest ? searchRequest : requested,
          incomingSearch: req.body.search,
        });
        // return res.json( { allQuestions: requested } );
      }
    } catch (e) {
      console.log({ e });
    }
  },

  getNewQuestionForm: async (req,res) => {
    const userCategories = await Category.find({userId: req.user.id});
    const defaultCategories = await Category.find({isDefault: true});
    const categori = userCategories.concat(defaultCategories);
    res.render('addQuestion', {categori})
  },

  createNewQuestion: async (req,res) => {
    try{
      let {
        question,
        categori,
        answer,
        newCategories,
      } = req.body;
      if (!categori) return res.status(400).json({message: "questions each need at least 1 category"});
      if (!question.trim().length) return res.status(400).json({message: "questions need content"});
      categori = Array.isArray(categori) ? categori : [categori];

      const cs = [];
      if (newCategories.trim().length){
        newCategories = newCategories.trim().split('VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULT').slice(1);
        newCategories = new Set(newCategories);
        for (const cat of categori) if (newCategories.has(cat)){
          const c = await Category.create({
            description: cat,
            userId: req.user.id,
            isDefault: false,
          })
          if (!c) res.json({message:`${cat} was not added to the database`})
          else cs.push(c);
        }
      }

      const quest = await Question.create({
        categories: categori,
        userId: req.user.id,
        content: question,
        answer: answer || null,
        isDefault: false,
      })
      if (!quest) return res.status(500).json({message:`question was not added to the database`})
      // return res.status(201).json({quest,cs});
      // return res.render('addQuestion').json({message:"question successfully uploaded"});
      return res.status(200).json({message:'question successfully added!'});
    }catch(questionCreationError){
      console.log({questionCreationError});
      res.status(500).json({message: "server error when creating question"});
    }
  },

  getEditSearchPage: async (req,res) => {
    try{

      const userQuestions = await Question.find({userId: req.user.id});
      if (!userQuestions.length) return res.redirect('/questions/form');
      const allCategories = await Category.find();

      return res.render('editSearch', {
        allCats: allCategories,
        allQuestions: userQuestions,
      })
    }catch(getEditSearchError){
      console.log({getEditSearchError});
      return res.status(400).json({message:"error retrieving user questions"})
    }
  },

  getEditQuestionPage: async(req,res) => {
    try{
      const {questionId} = req.body;
      const user = await User.findById(req.user.id);
      const question = await Question.findById(questionId);
      if (!question.userId || question.userId.toString() !== req.user.id) return res.status(403).json({message: "this question isnt yours to change"});
      res.render('editQuestion', {
      question,
      categori: question.categories || [],
      })
    }catch(getEditQuestionError){
      console.log(getEditQuestionError)
      return res.status(500).json({message: getEditQuestionError.message});
    }
  },

  updateQuestion: async(req,res) => {
    try{
      const body = req.body;
      let {
        categori,
        answer,
        question,
        questionId,
      } = req.body;
      if (!categori || !categori.length) return res.status(404).json({message:"questions each need at least 1 category"});
      if (!question.trim().length) return res.status(404).json({message:"questions need content"});
      const categories = Array.isArray(categori) ? categori : [categori];

      const quest = await Question.findById(questionId);
      if (!quest.userId || quest.userId.toString() !== req.user.id) return res.status(403).json({message: "this question isnt yours to change"});

      const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        {$set:{
          content: question,
          userId: req.user.id,
          categories,
          answer: answer || null,
        }},
        {new:true}
      );
      return res.redirect('/questions/edit/select')
    }catch(updateQuestionError){
      console.log({updateQuestionError});
      return res.status(500).json({message: updateQuestionError.message});
    }
  },
};
