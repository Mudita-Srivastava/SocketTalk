// models/Message.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  username: String,
  room: String,
  message: String,
  time: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("message", messageSchema);

export default Message;
