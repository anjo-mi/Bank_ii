import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    validate: {
      validator: function (prop) {
        return typeof prop === "string";
      },
      message: "descriptions must be strings",
    },
  },

  isDefault: {
    type: Boolean,
    required: true,
  },

  // user: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  // },
});

export default mongoose.model("Category", categorySchema);
