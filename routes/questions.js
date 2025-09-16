import express from "express";
import questionsController from "../controllers/questions.js";
const router = express.Router();

router.get("/", questionsController.getAllQuestions);
router.get("/categories", questionsController.getQuestionsByCats);
router.get("/byId", questionsController.getQuestionById);

export default router;
