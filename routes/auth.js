import express from "express";
import authController from "../controllers/auth.js";
import limiter from "../middleware/limiter.js";

const router = express.Router();

router.get("/", authController.getLoginPage);
router.get("/signup", authController.getRegisterPage);
router.post("/register", limiter, authController.registerNewUser);
router.post("/login", limiter, authController.login);
router.post("/logout", authController.logout);

export default router;
