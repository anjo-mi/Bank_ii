import mongoose from "mongoose";
import validator from "email-validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.validate(email),
      message: "your email does not match the standard format"
    }
  },

  password: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    unique: true,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  preferences: {
    type: Object,
    default: {},
  },
},
{
  methods: {
    comparePassword: async function(inputtedPassword){
      const user = this;
      const isMatch = await bcrypt.compare(inputtedPassword,user.password);
      return isMatch;
    }
  }
});

userSchema.pre('save', async function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  try{
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    next()
  }catch(e){
    next(e);
  }
})

export default mongoose.model("User", userSchema);
