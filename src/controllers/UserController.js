const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const FriendRequest = require("../models/FriendRequesModel");

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!name || !email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is equal confirmPassword",
      });
    }
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email", email);
    console.log("password", password);
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }
    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newReponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({ ...newReponse, refresh_token });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await UserService.deleteManyUser(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getUsers = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    console.log("keyword", keyword);
    const users = await User.find(keyword);
    res.send(users);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("userId at get user ID", userId);
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const sendFriendRequest = async (req, res) => {
  const senderId = req.user._id; // ID của người gửi kết bạn
  const { receiverId } = req.body; // ID của người nhận kết bạn

  console.log("senderId", senderId);
  console.log("receiverId", receiverId);

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    console.log("sender", sender);
    console.log("receiver", receiver);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    // Kiểm tra xem đã gửi lời mời kết bạn chưa
    const existingFriendRequest = await FriendRequest.findOne({
      senderId: senderId,
      receiverId: receiverId,
    });

    if (existingFriendRequest) {
      return res
        .status(400)
        .json({ message: "Friend request already sent to this user" });
    }

    //kiểm tra 2 người đã là bạn chưa
    if (sender.friends.includes(receiverId)) {
      return res
        .status(400)
        .json({ message: "You are already friend with this user" });
    }

    const friendRequest = new FriendRequest({
      senderId: senderId,
      receiverId: receiverId,
    });

    await friendRequest.save();
    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  // const { senderId } = req.body;
  // const receiverId = req.user._id;

  const receiverId = req.user._id; // ID của người gửi kết bạn
  const { senderId } = req.body; // ID của người nhận kết bạn

  console.log("senderId", senderId);
  console.log("receiverId", receiverId);
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    const friendRequest = await FriendRequest.findOne({
      senderId: senderId,
      receiverId: receiverId,
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    //update status of friend request
    friendRequest.status = "accepted";
    //save friend request
    await friendRequest.save();

    //add friend to sender's friend list
    sender.friends.push(receiverId);
    await sender.save();

    receiver.friends.push(senderId);
    await receiver.save();

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  const { senderId } = req.body;
  const receiverId = req.user._id;
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    const friendRequest = await FriendRequest.findOne({
      senderId: senderId,
      receiverId: receiverId,
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    //update status of friend request
    friendRequest.status = "reject";
    //save friend request
    await friendRequest.save();

    //add friend to sender's friend list
    sender.friends.push(receiverId);
    await sender.save();

    receiver.friends.push(senderId);
    await receiver.save();

    res.status(200).json({ message: "Friend request reject successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    let token = req.cookies.refresh_token;
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      message: "Logout successfully",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getUsers,
  getDetailsUser,
  sendFriendRequest,
  refreshToken,
  logoutUser,
  deleteMany,

  acceptFriendRequest,
};
