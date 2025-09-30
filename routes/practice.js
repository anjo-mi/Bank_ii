import express from "express";
import practiceController from "../controllers/practice.js";
const router = express.Router();

router.get("/", practiceController.getCategories);
router.post("/start", practiceController.startPractice);

export default router;
