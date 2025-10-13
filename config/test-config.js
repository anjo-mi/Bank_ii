import { store } from "../middleware/limiter.js";
import dotenv from "dotenv";
dotenv.config();

// used in specific test cases to avoid hitting rate limit
export default {
  clearLimits: (req, res) => {
    store.resetAll();
    res.sendStatus(200)
  },
}