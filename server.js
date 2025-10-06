import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Message from "./models/Message.js";
import "dotenv/config";

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("🟢 New user connected");

  socket.on("joinRoom", async ({ username, room }) => {
    socket.join(room);

    const messages = await Message.find({ room }).sort({ time: 1 }).limit(10);
    socket.emit("loadMessages", messages);

    socket.broadcast.to(room).emit("message", {
      username: "System",
      message: `${username} has joined the chat`,
    });
  });

  socket.on("chatMessage", async ({ username, room, message }) => {
    const msg = new Message({ username, room, message });
    await msg.save();

    io.to(room).emit("message", { username, message });
  });

  socket.on("typing", ({ username, room }) => {
    socket.broadcast.to(room).emit("userTyping", username);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
