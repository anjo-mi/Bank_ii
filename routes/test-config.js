import express from "express";
import testConfig from "../config/test-config.js";
const router = express.Router();

router.post("/clearLimits", testConfig.clearLimits);

export default router;