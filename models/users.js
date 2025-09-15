import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: String,

  username: {
    type: String,
    unique: false,
    required: true,
  },
});

export default mongoose.model("User", userSchema);
