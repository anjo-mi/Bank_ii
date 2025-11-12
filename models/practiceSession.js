import mongoose from "mongoose";

const practiceSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
  },

  questions:{
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Question',
        required:true,
    }],
    required:true,
    validate: {
      validator: (questions) => Array.isArray(questions) && questions.length,
      message: 'questions array needs to exist and contain questions',
    },
  },
  answers: {
    type: [{type:String}],
    default: [],
  },
  
  completedAt: {
    type: Date,
    default: Date.now
  },

  aiResponse:{
    type: {
      questionResponse: [{
        questionId: mongoose.Schema.Types.ObjectId,
        feedback: String,
        resources: [String]
      }],
      completedAt: Date,
    },
    default:{},
  }
});

export default mongoose.model("PracticeSession", practiceSessionSchema);