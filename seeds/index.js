import mongoose from "mongoose";
import dotenv from "dotenv";
import { categories } from "./categories.js";
import { questions } from "./questions.js";
import models from "../models/index.js";
const { Category, User, Question, PracticeSession } = models;

dotenv.config();

const populateDB = async () => {
  try {
    await mongoose.connect(process.env.DB_STR);
    await PracticeSession.deleteMany({});
    await Question.deleteMany({ parentId: { $ne: null } });
    await Question.deleteMany({ isDefault: true });
    await Category.deleteMany({ isDefault: true });
    // await User.deleteMany({});
    console.log("removed any residual data");

    await Question.insertMany(questions);
    await Category.insertMany(categories);
    console.log("seed data placed into corresponding DBs");
  } catch (err) {
    console.log(`Error: ${err}`);
  } finally {
    mongoose.connection.close();
    console.log("connection closed");
  }
};

populateDB();
