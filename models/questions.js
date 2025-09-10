import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    answer: {
        type: String,
        default: null,
    },

    categories: [{
        type: String,
    }],
    // categories: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category',
    // }],

    content: String,

    title: String,

    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // },

})

export default questionSchema;