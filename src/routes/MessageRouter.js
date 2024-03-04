const express = require("express");
const router = express.Router();
const messageController = require("../controllers/MessageController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleware");

router.get("/:chatId", authUserMiddleWare, messageController.allMessages);
router.post("/", authUserMiddleWare, messageController.sendMessage);

module.exports = router;
