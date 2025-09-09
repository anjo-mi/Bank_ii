import express from "express";
import cors from "cors";
import homeRoutes from "./routes/home.js";
import connectDB from "./config/database.js";

import dotenv from "dotenv";
dotenv.config({path: './config/.env'});

connectDB();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', homeRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log('server successfully running!')
})