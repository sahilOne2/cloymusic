import { config } from "dotenv";
config()
console.log(process.env.MONGO_URI);

import mongoose from "mongoose";
const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to db successfully");
        
    }catch(error){
        console.log("Error Connecting to db",error);
        process.exit(1)
    }
}

export default connectDb;

