import express from "express";
import { config } from "dotenv";
import DBConnection from "./utils/database.js";
import userRoutes from "./routes/user.js";
import chatRoutes from './routes/chat.js'
import cors from "cors";
const PORT = process.env.PORT || 5000;
const app = express();
// app.use(express.urlencoded({}));
app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use('/chat' , chatRoutes);

const connection = async () => {
  try {
    await DBConnection();
    app.listen(PORT, () => {
      console.log(`server is running on prot ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

connection();
