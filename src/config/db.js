import mongoose from "mongoose";
import env from "./env.js";

async function connectDb() {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is required");
  }
  try{
    await mongoose.connect(env.mongoUri);
    console.log("DB Connected");
  } catch(e){
    console.log("An error happened while connect");
  }

}

export { connectDb };
