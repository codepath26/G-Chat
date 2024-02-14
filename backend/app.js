import express from "express";
import { config } from "dotenv";
import DBConnection from "./utils/database.js";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import messageRoutes from "./routes/message.js";
import { Server } from "socket.io";
import cors from "cors";
const PORT = process.env.PORT || 5000;
const app = express();
// app.use(express.urlencoded({}));
app.use(cors());
app.use(express.json());
config();
app.use(userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

const connection = async () => {
  try {
    await DBConnection();
    const server = app.listen(PORT, () => {
      console.log(`server is running on prot ${PORT}`);
    });
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:3000",
      },
    });

    io.on("connection", (socket) => {
      console.log("connected to socket.io");
      socket.on("setup", (userData) => {
        console.log(userData , 'from fronted side this userdeat');
        socket.join(userData._id);
        socket.emit("connected");
      });
      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room" + room);
      });
      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
          console.log(
            "we are at here wheat is the value of tue user is ",
            user
          );
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

connection();
