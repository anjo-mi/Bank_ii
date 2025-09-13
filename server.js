import express from "express";
import cors from "cors";
import homeRoutes from "./routes/home.js";
import categoriesRoutes from "./routes/category.js";
import questionsRoutes from "./routes/questions.js";
import connectDB from "./config/database.js";

import dotenv from "dotenv";
dotenv.config();

connectDB();

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", homeRoutes);
app.use("/categories", categoriesRoutes);
app.use("/questions", questionsRoutes);

// Only start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(process.env.PORT || 3000, () => {
    console.log("server successfully running!");
  });
}

export default app;
