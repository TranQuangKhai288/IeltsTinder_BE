const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");

const allMessages = async (chatId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const messages = await Message.find({ chat: chatId })
        .populate("sender", "name")
        .populate({
          path: "chat",
          populate: {
            path: "users",
            select: "id name",
          },
        });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: messages,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const sendMessage = async (senderId, content, chatId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ChatId = await Chat.findById(chatId);
      if (!ChatId) {
        reject("Chat not found");
      } else {
        let message = await Message.create({
          sender: senderId,
          content,
          chat: chatId,
        });
        message = await message.populate("sender", "name");
        message = await User.populate(message, {
          path: "chat.users",
          select: "name",
        });

        ChatId.latestMessage = message;
        await ChatId.save();
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: message,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  allMessages,
  sendMessage,
};
