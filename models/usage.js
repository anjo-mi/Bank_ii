import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  month: { type: String, unique: true },
  tokenCost: { type: Number, default: 0 },
  searches: { type: Number, default: 0 },
});

export default mongoose.model("Usage", usageSchema);
