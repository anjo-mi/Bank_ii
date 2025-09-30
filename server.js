// package dependencies
import express from "express";
import expressLayouts from "express-ejs-layouts";

// dev dependencies
import cors from "cors";
import logger from "morgan";

// router imports
import homeRoutes from "./routes/home.js";
import categoriesRoutes from "./routes/category.js";
import questionsRoutes from "./routes/questions.js";
import practiceRoutes from "./routes/practice.js";

// database connection logic
import connectDB from "./config/database.js";

// .env imports
import dotenv from "dotenv";
dotenv.config();

connectDB();

const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("combined"));
app.use(cors());

app.use("/", homeRoutes);
app.use("/categories", categoriesRoutes);
app.use("/questions", questionsRoutes);
app.use("/practice", practiceRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("server successfully running!");
});

export default app;
