import express from "express";
import questionsController from "../controllers/questions.js";
const router = express.Router();

// protect specific question routes from unauthorized access
import auth from '../middleware/auth.js';
const {ensureAuth} = auth;

router.get("/", questionsController.getAllQuestions);
router.get("/form", ensureAuth, questionsController.getNewQuestionForm);
router.post("/create", ensureAuth, questionsController.createNewQuestion);
router.post("/byCategory", questionsController.getQuestionsByCats);
router.post("/byId", questionsController.getQuestionById);

export default router;
