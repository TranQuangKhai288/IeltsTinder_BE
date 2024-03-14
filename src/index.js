const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
//const { app, server, io } = require("./socket/socket");

const socketIo = require("socket.io");
const app = express();
dotenv.config();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect Db success!");
  })
  .catch((err) => {
    console.log(err);
  });

const server = http.createServer(app);
const io = socketIo(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("setup", (dataUser) => {
    socket.join(dataUser._id);
    socket.emit("connencted");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
server.listen(port, () => {
  console.log("Server is running in port: ", +port);
});
