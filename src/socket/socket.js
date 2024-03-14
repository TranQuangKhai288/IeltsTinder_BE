const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    pingTimeout: 60000,
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected to socket.io", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

module.exports = { app, io, server };
