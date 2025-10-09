import express from "express";
import authController from "../controllers/auth.js";
const router = express.Router();

router.get("/", authController.getRegisterPage);
router.post("/register", authController.registerNewUser);
router.post("/login", authController.login);

export default router;
