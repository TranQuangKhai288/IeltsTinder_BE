const asyncHandler = require("express-async-handler");
const PostService = require("../services/PostService");
const User = require("../models/UserModel");
//@description     Get all Post for a User
//@route           GET /api/post/:userId
//@access          Protected

const allPost = asyncHandler(async (req, res) => {
  //check if the user is valid
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({
      status: "ERR",
      message: "User not found",
    });
  }
  try {
    const response = await PostService.allPost(req.params.userId);
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Add a Post for a User
//@route           POST /api/post/
//@access          Protected

const addPost = asyncHandler(async (req, res) => {
  const { content, media } = req.body;

  if (!content) {
    return res.status(400).json({
      status: "ERR",
      message: "content is required",
    });
  }

  try {
    const response = await PostService.addPost(req.user._id, content, media);
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get all Comments for a Post
//@route           GET /api/post//comment/:postId
//@access          Protected
const allComments = asyncHandler(async (req, res) => {
  try {
    const response = await PostService.allComments(req.params.postId);
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Add a Comment to a Post
//@route           POST /api/post/comment/
//@access          Protected
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;

  if (!content || !postId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    const response = await PostService.addComment(
      req.user._id,
      content,
      postId
    );
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  allPost,
  addPost,
  allComments,
  addComment,
};
