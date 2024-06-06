const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostController");
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.get("/:userId", postController.allPostOfAUser);
router.post("/", authUserMiddleWare, postController.addPost);
router.get("/comments/:postId", postController.allComments);
router.post("/comment/:postId", authUserMiddleWare, postController.addComment);
router.post("/like/:postId", authUserMiddleWare, postController.putLike);
router.post("/unlike/:postId", authUserMiddleWare, postController.deleteLike);
router.get("/", postController.allPost);

module.exports = router;
