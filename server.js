// package dependencies
import express from "express";
import expressLayouts from "express-ejs-layouts";
import passport from "passport";
import "./passport.config.js";
import session from "express-session";
import MongoStore from "connect-mongo";

// dev dependencies
import cors from "cors";
import logger from "morgan";

// router imports
import homeRoutes from "./routes/home.js";
import categoriesRoutes from "./routes/category.js";
import questionsRoutes from "./routes/questions.js";
import practiceRoutes from "./routes/practice.js";
import authRoutes from "./routes/auth.js";
import testConfig from "./routes/test-config.js";

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

// sessions
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 3,
    httpOnly: true,
    secure: false,
  },
  store: MongoStore.create({
    mongoUrl: process.env.DB_STR,
    collectionName: 'sessions',
  }),
}));
app.use(passport.authenticate('session'));

// routes
app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/practice", practiceRoutes);
app.use("/questions", questionsRoutes);

// test configuration (/test/pw-auth/login-reg)
app.use("/test", testConfig);

app.listen(process.env.PORT || 3000, () => {
  console.log("server successfully running!");
});

export default app;
