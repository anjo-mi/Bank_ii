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
    default: false,
    required: true,
  },
});

categorySchema.index({userId:1,description:1},{unique:true});

export default mongoose.model("Category", categorySchema);
