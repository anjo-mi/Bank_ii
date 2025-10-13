import express from "express";
import testConfig from "../config/test-config.js";

const router = express.Router();

router.post("/clearLimits", testConfig.clearLimits);

// used for clearing request counts between test suites
export default router;