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
  // categories: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Category',
  // }],

  content: {
    type: String,
    required: true,
  },

  isDefault: Boolean,

  // user: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  // },
});

export default mongoose.model("Question", questionSchema);
