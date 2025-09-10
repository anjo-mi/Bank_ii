import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    
    description: String,

    isDefault: Boolean,

    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // },

})

export default categorySchema;