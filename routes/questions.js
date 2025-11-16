import express from "express";
import questionsController from "../controllers/questions.js";
const router = express.Router();

// protect specific question routes from unauthorized access
import auth from '../middleware/auth.js';
const {ensureAuth} = auth;

// open
router.get("/", questionsController.getAllQuestions);
router.post("/byCategory", questionsController.getQuestionsByCats);
router.post("/byId", questionsController.getQuestionById);
router.post("/getSingleRandom", questionsController.getRandomQuestion);

// move along, nothing to see here
router.get("/form", ensureAuth, questionsController.getNewQuestionForm);
router.get("/edit/select", ensureAuth, questionsController.getEditSearchPage);
router.post("/create", ensureAuth, questionsController.createNewQuestion);
router.post("/answerQuestion", ensureAuth, questionsController.answerQuestion);
router.post("/saveAnswer", ensureAuth, questionsController.saveAnswer);
router.post("/edit", ensureAuth, questionsController.getEditQuestionPage);
router.post("/edit/update", ensureAuth, questionsController.updateQuestion);
router.delete("/delete/:id", ensureAuth, questionsController.deleteQuestion);

export default router;
