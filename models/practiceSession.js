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
    required:true,
    validate: {
      validator: (answers) => Array.isArray(answers) && answers.length,
      message: 'answers array needs to exist and contain questions',
    },
  },
  
  completedAt: {
    type: Date,
    default: Date.now
  },

  aiResponse:{
    type: {
      sessionScore: Number,
      questionResponse: [{
        questionId: mongoose.Schema.Types.ObjectId,
        score: Number,
        feedback: String,
        resources: [String]
      }],
      categoryScores: Object,
      completedAt: Date,
    },
    default:null,
  }
});

export default mongoose.model("PracticeSession", practiceSessionSchema);