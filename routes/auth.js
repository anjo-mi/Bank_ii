import express from "express";
import authController from "../controllers/auth.js";
const router = express.Router();

router.get("/", authController.getLoginPage);
router.get("/signup", authController.getRegisterPage);
router.post("/register", authController.registerNewUser);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
