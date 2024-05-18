const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const { ExpressPeerServer } = require("peer");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    pingTimeout: 60000,
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
});

app.use("/mypeer", peerServer);

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join-a-chat-room", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });

  socket.on("stop-typing", (room) => {
    socket.to(room).emit("stop-typing");
  });

  socket.on("new-message", async (newMessageReceived) => {
    try {
      const chat = await Chat.findById(newMessageReceived.chat).populate(
        "users"
      );
      if (!chat) return;

      chat.users.forEach((user) => {
        if (user._id.toString() !== newMessageReceived.sender._id.toString()) {
          socket
            .to(user._id.toString())
            .emit("receive-message", newMessageReceived);
        }
      });
    } catch (error) {
      console.error("Error handling new message:", error);
    }
  });

  socket.on("new-call", async (data) => {
    const { chatRoomId, callerId, rtcMessage } = data;
    const callRoomId = `${callerId}-${chatRoomId}`;
    console.log(chatRoomId);
    socket.join(callRoomId);
    //find the use in chat room:
    const chatRoom = await Chat.findById(chatRoomId);
    const userIds = chatRoom.users.map((user) => user._id.toString());
    const receiverId = userIds.find((id) => id !== callerId);
    socket.to(receiverId.toString()).emit("incoming-call", {
      callRoomId: callRoomId,
      callerId: callerId,
      rtcMessage: rtcMessage,
    });
  });

  socket.on("accept-call", (data) => {
    const { callRoomId, rtcMessage } = data;
    socket.join(callRoomId);
    socket.broadcast.to(callRoomId).emit("accepted", {
      rtcMessage: rtcMessage,
    });
  });

  socket.on("reject-call", (data) => {
    const { callRoomId, rtcMessage } = data;
    socket.join(callRoomId);
    socket.broadcast.to(callRoomId).emit("rejected");
  });

  socket.on("end-call", (data) => {
    const { callRoomId, rtcMessage } = data;
    socket.join(callRoomId);
    socket.broadcast.to(callRoomId).emit("rejected");
  });

  socket.on("rtc-message", (data) => {
    const { callRoomId, type, sdp, candidate } = data;

    // Kiểm tra dữ liệu đầu vào
    if (!callRoomId || (!sdp && !candidate)) {
      console.error("Invalid rtc-message data:", data);
      return;
    }

    // Kiểm tra kiểu tin nhắn
    if (type === "offer" || type === "answer") {
      if (!sdp || typeof sdp !== "object") {
        console.error("Invalid SDP data:", sdp);
        return;
      }
    } else if (type === "candidate") {
      if (!candidate || typeof candidate !== "object") {
        console.error("Invalid ICE candidate data:", candidate);
        return;
      }
    } else {
      console.error("Invalid rtc-message type:", type);
      return;
    }

    // Phát tin nhắn đến phòng cuộc gọi
    io.to(callRoomId).emit("rtc-message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

module.exports = { app, io, server };
