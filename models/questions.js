import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  answer: {
    type: String,
    default: null,
  },

  categories: [
    {
      type: String,
      required: true,
    },
  ],

  content: {
    type: String,
    required: true,
  },

  isDefault: Boolean,
});

export default mongoose.model("Question", questionSchema);
