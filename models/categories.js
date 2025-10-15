import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  
  isDefault: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Category", categorySchema);
