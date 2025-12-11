import mongoose from "mongoose";
import validator from "email-validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  // in case html checks fail, add email validation to the Schema itself
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.validate(email),
      message: "your email does not match the standard format"
    }
  },

  // v ^ both username and password must be unique
  
  username: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  resources: {
    type: [String],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  preferences: {
    type: Object,
    default: {},
  },

  info: {
    type: {
      title: String,
      level: String,
    },
    default: {},
  },

  tokens: {
    type: Number,
    default: 15,
  },

  tokenReset: {
    type: Date,
    default: Date.now,
  },
},
{
  // add a compare method to be called with passports (Local Strat) login attempts
  methods: {
    comparePassword: async function(inputtedPassword){
      const user = this;
      const isMatch = await bcrypt.compare(inputtedPassword,user.password);
      return isMatch;
    }
  }
});

// before a user is saved in the database, encrypt their password
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
