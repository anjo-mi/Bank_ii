import express from "express";
import transcriber from "../services/transcribe.js";
const router = express.Router();

// parse formData for audio storage
import multer from "multer";
const upload = multer({storage: multer.memoryStorage()});


router.post("/transcribe", upload.single('audio'), transcriber.transcribe);

export default router;