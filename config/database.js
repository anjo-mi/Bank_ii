import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: './config/.env'});

const uri = process.env.DB_STR;
const connect = async () => {
    try{
        const connection = await mongoose.connect(uri);
        console.log(`successful connection to mongo DB at ${connection.connection.host}`);
    }catch (e){
        console.log(e);
        process.exit(1);
    }
}

export default connect;