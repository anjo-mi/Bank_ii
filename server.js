import express from "express";
import cors from "cors";
import homeRoutes from "./routes/home.js"

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', homeRoutes);

app.listen(3000, () => {
    console.log('server successfully running!')
})