const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    pingTimeout: 60000,
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  console.log("addingUser");
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connected
  console.log("a user connected to socket.io", socket.id);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    // Tìm người nhận theo ID
    console.log("sendMessage", senderId, receiverId, text);
    const receiver = getUser(receiverId);
    if (receiver) {
      // Gửi tin nhắn đến người nhận
      io.to(receiver.socketId).emit("getMessage", {
        senderId,
        text,
      });
    } else {
      console.log("Receiver not found");
    }
  });

  //when disconnected
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

module.exports = { app, io, server };
