import mongoose from "mongoose";
import { type } from "os";

const questionSchema = new mongoose.Schema({
  answer: {
    type: String,
    default: null,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
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

  isDefault: {
    type: Boolean,
    default: false,
  },

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

  feedback: {
    type: String,
    default: '',
  },

  audioKey: {
    type: String,
    default: '',
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model("Question", questionSchema);
