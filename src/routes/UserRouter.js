const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleware");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/log-out", userController.logoutUser);

router.put("/update-user/:id", authUserMiddleWare, userController.updateUser);
router.delete("/delete-user/:id", authMiddleWare, userController.deleteUser);
router.get("/", authUserMiddleWare, userController.getUsers);
router.get(
  "/get-details/:id",
  authUserMiddleWare,
  userController.getDetailsUser
);

router.post(
  "/send-friend-request/",
  authUserMiddleWare,
  userController.sendFriendRequest
);

router.post(
  "/accept-friend-request/",
  authUserMiddleWare,
  userController.acceptFriendRequest
);

router.post("/refresh-token", userController.refreshToken);
router.post("/delete-many", authMiddleWare, userController.deleteMany);

module.exports = router;
