import express from "express";
import authController from "../controllers/auth.js";
const router = express.Router();

router.get("/", authController.getLogin);
router.post("/register", authController.registerNewUser);
router.post("/login", authController.login);

export default router;
