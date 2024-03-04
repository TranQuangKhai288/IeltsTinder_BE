const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");

// accessChat,
const accessChat = async (currentUserId, targetUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: currentUserId } } },
          { users: { $elemMatch: { $eq: targetUserId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");

      isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });

      if (isChat.length > 0) {
        resolve(isChat[0]);
      } else {
        const chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [currentUserId, targetUserId],
        };

        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );

        resolve({
          status: "OK",
          message: "SUCESS",
          data: fullChat,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const fetchChats = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      const fullChat = await User.populate(chats, {
        path: "latestMessage.sender",
        select: "name pic email",
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: fullChat,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const createGroupChat = async (groupChatData, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!groupChatData.users || !groupChatData.name) {
        throw new Error("Please fill in all the fields");
      }

      const users = JSON.parse(groupChatData.users);

      if (users.length < 2) {
        throw new Error("More than 2 users are required to form a group chat");
      }

      users.push(user);

      const groupChat = await Chat.create({
        chatName: groupChatData.name,
        users: users,
        isGroupChat: true,
        groupAdmin: user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: fullGroupChat,
      });
    } catch (error) {
      reject(e);
    }
  });
};

const renameGroup = async (chatId, chatName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          chatName: chatName,
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      if (!updatedChat) {
        throw new Error("Chat Not Found");
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedChat,
      });
    } catch (error) {
      reject(e);
    }
  });
};
// addToGroup,
// removeFromGroup,

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
};
