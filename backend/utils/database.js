import mongoose from "mongoose";
import colors from "colors";
import { config } from "dotenv";
config();

const DBConnection = async () => {
  try {
    console.log(process.env.DB_URI);
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB connected : ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default DBConnection;
