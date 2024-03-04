const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/UserModel.js");

dotenv.config();

const authMiddleWare = (req, res, next) => {
  const tokenHeader = req.headers.token;

  // Check if the token header exists and is in the expected format
  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    console.log("tokenHeader", tokenHeader);
    return res.status(401).json({
      message: "Authentication failed",
      status: "ERROR",
    });
  }

  // Extract the token
  const token = tokenHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: "Authentication failed",
        status: "ERROR",
      });
    }
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: "Unauthorized",
        status: "ERROR",
      });
    }
  });
};

const authUserMiddleWare = async (req, res, next) => {
  try {
    // Lấy token từ header 'token'
    let tokenHeader = req.headers.token;
    while (!tokenHeader) {
      await new Promise((resolve) => (tokenHeader = req.headers.token)); // Chờ 0.000000ms trước khi kiểm tra lại
    }
    const token = await tokenHeader.split(" ")[1];
    // Giải mã token
    jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          message: err.message,
          status: "ERROR",
        });
      }
      try {
        const user = await User.findOne({
          _id: decoded.id,
          "tokens.token": token,
        });
        if (!user) {
          throw new Error("User not found");
        }
        req.user = user; // Thiết lập req.user
        console.log("decoded", decoded);
        next();
      } catch (error) {
        return res.status(401).json({
          message: error.message,
          status: "ERROR",
        });
      }
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(401).send({ error: error.message });
  }
};

module.exports = {
  authMiddleWare,
  authUserMiddleWare,
};
