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
    console.log(
      "User connected with user ID:",
      userData._id,
      "and socket ID:",
      socket.id
    );
  });

  //when in a room
  socket.on("join-a-chat-room", (room) => {
    socket.join(room);
    console.log("User joined room BE", room);
  });

  socket.on("typing", (room) => {
    console.log("typing");
    socket.in(room).emit("typing");
  });
  socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));
  //sent message
  socket.on("new-message", (newMessageRecieved) => {
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
              console.log("chat seing");
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

  socket.on("video-call", (data) => {
    const { chatRoomId, callerId } = data;
    console.log("video-call", data);
    // Tạo một phòng gọi mới giữa người gọi và người nhận cuộc gọi
    const callRoom = `${callerId}-${chatRoomId}`;
    socket.join(callRoom);
    //Thông báo cho người nhận khác trong nhóm về cuộc gọi

    socket.broadcast
      .to(chatRoomId)
      .emit("incoming-call", { callRoomId: callRoom, callerId });
  });

  socket.on("accept-call", (data) => {
    const { callRoomId } = data;

    console.log("accept-call", data);

    // Tìm phòng gọi giữa hai người và chuyển cả hai vào phòng đó

    socket.join(callRoomId);

    // Gửi sự kiện "accepted" và luồng dữ liệu tới cả hai người trong phòng gọi
    io.to(callRoomId).emit("accepted");
  });

  socket.on("ICEcandidate", (data) => {
    console.log("ICEcandidate data.calleeId", data.calleeId);
    let calleeId = data.calleeId;
    let rtcMessage = data.rtcMessage;

    socket.to(calleeId).emit("ICEcandidate", {
      sender: socket.user,
      rtcMessage: rtcMessage,
    });
  });

  //when disconnected
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

module.exports = { app, io, server };
