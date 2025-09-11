import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        unique: true,
    },
    
    password: String,

    username: {
        type:String,
        unique: false,
    },
})

export default userSchema;