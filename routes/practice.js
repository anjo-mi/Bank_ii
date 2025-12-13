import express from "express";
import practiceController from "../controllers/practice.js";

// protect all practice routes from unauthorized access
import auth from '../middleware/auth.js';
const {ensureAuth} = auth;

// parse formData for audio storage
import multer from "multer";
const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();

router.get("/", ensureAuth, practiceController.getCategories);
router.get("/history", ensureAuth, practiceController.getSessions);
router.get("/session-status", ensureAuth, practiceController.checkStatus);
router.get("/getLoadResults", ensureAuth, practiceController.getLoadResults);
router.get("/:id", ensureAuth, practiceController.getResults);
router.post("/start", ensureAuth, practiceController.startPractice);
router.post("/next", ensureAuth, upload.single('audio'), practiceController.showNext);
router.post("/checkSession", ensureAuth, practiceController.checkSession);
router.patch("/delete", ensureAuth, practiceController.deleteSession);

export default router;
