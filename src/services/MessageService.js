const Message = require("../models/MessageModel");
const User = require("../models/UserModel");

const allMessages = async (chatId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const messages = await Message.find({ chat: chatId })
        .populate("sender", "name pic email")
        .populate({
          path: "chat",
          populate: {
            path: "users",
            select: "id name avatar",
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
      let message = await Message.create({
        sender: senderId,
        content,
        chat: chatId,
      });
      message = await message.populate("sender", "name pic email");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: message,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  allMessages,
  sendMessage,
};
