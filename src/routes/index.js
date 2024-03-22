const UserRouter = require("./UserRouter");
const ChatRouter = require("./ChatRouter");
const MessageRouter = require("./MessageRouter");
const PostRouter = require("./PostRouter");
const ExerciseRouter = require("./ExerciseRouter");
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/chat", ChatRouter);
  app.use("/api/message", MessageRouter);
  app.use("/api/post", PostRouter);
  app.use("/api/exercise", ExerciseRouter);
};

module.exports = routes;
