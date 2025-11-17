import express from "express";
import practiceController from "../controllers/practice.js";

// protect all practice routes from unauthorized access
import auth from '../middleware/auth.js';
const {ensureAuth} = auth;

const router = express.Router();

router.get("/", ensureAuth, practiceController.getCategories);
router.get("/history", ensureAuth, practiceController.getSessions);
router.get("/getLoadResults", ensureAuth, practiceController.getLoadResults);
router.get("/:id", ensureAuth, practiceController.getResults);
router.post("/start", ensureAuth, practiceController.startPractice);
router.post("/next", ensureAuth, practiceController.showNext);
router.post("/checkSession", ensureAuth, practiceController.checkSession);

export default router;
