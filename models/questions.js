import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  answer: {
    type: String,
    default: null,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model("Question", questionSchema);
