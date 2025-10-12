import { store } from "../middleware/limiter.js";
import dotenv from "dotenv";
dotenv.config();

export default {
  clearLimits: (req, res) => {
    store.resetAll();
    res.sendStatus(200)
  },
}