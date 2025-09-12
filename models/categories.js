import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },

  isDefault: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Category", categorySchema);
