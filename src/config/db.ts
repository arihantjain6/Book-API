import mongoose from "mongoose";
import { config } from "./config.ts";
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ Connected to Database.");
    });
    mongoose.connection.on("error", (error) => {
      console.log("❌ Error connecting to Database.", error);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.log("❌ Failed to connect to Database.", error);
    process.exit(1);
  }
};

export default connectDB;
