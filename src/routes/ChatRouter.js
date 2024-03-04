const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleware");

router.post("/", authUserMiddleWare, chatController.accessChat);
router.get("/", authUserMiddleWare, chatController.fetchChats);
router.post("/group", authUserMiddleWare, chatController.createGroupChat);
router.put("/rename", authUserMiddleWare, chatController.renameGroup);
router.put("/groupremove", authUserMiddleWare, chatController.removeFromGroup);
router.put("/groupadd", authUserMiddleWare, chatController.addToGroup);
module.exports = router;
