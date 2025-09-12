import mongoose from "mongoose";
import dotenv from "dotenv";
import { categories } from "./categories.js";
import { users } from "./users.js";
import { questions } from "./questions.js";
import models from "../models/index.js";
const { Category, User, Question } = models;

dotenv.config();

const populateDB = async () => {
  try {
    await mongoose.connect(process.env.DB_TEST_STR);
    await Category.deleteMany({});
    await User.deleteMany({});
    await Question.deleteMany({});
    console.log("removed any residual data");

    await Category.insertMany(categories);
    await Question.insertMany(questions);
    await User.insertMany(users);
    console.log("seed data placed into corresponding DBs");
  } catch (err) {
    console.log(`Error: ${err}`);
  } finally {
    mongoose.connection.close();
    console.log("connection closed");
  }
};

populateDB();
