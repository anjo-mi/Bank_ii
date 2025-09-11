import {} from "../models/index.js";

export default {
    getHome: (req,res)=>{
        res.render('index.ejs')
    }
}