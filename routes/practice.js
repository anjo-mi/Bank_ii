import express from "express";
import practiceController from "../controllers/practice.js";
import auth from '../middleware/auth.js';
const {ensureAuth} = auth;
const router = express.Router();

router.get("/", ensureAuth, practiceController.getCategories);
router.post("/start", ensureAuth, practiceController.startPractice);
router.post("/next", ensureAuth, practiceController.showNext);

export default router;
