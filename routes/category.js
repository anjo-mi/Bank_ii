import express from "express";
import categoryController from "../controllers/categories.js";
const router = express.Router();

router.get("/", categoryController.getCategories);

export default router;
