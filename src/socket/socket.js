const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    pingTimeout: 60000,
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //when connected
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
    console.log("User connected", userData._id);
  });

  //when in a room
  socket.on("join-a-chat-room", (room) => {
    socket.join(room);
    console.log("User joined room BE", room);
  });

  //sent message
  socket.on("new-message", (newMessageRecieved) => {
    console.log("New message recieved: ", newMessageRecieved);
    var chat = Chat.findById(newMessageRecieved.chat).populate("users");
    chat.exec(function (err, chat) {
      if (err) {
        console.error("Error:", err);
      } else {
        if (chat) {
          chat.users.forEach((user) => {
            if (
              user._id.toString() !== newMessageRecieved.sender._id.toString()
            ) {
              io.to(newMessageRecieved.chat).emit(
                "receive-message",
                newMessageRecieved
              );
              console.log("Message sent to: ", user._id);
            }
          });
        } else {
          console.log("Chat not found");
        }
      }
    });
  });

  //when disconnected
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

module.exports = { app, io, server };
