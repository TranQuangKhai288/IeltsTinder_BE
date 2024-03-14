const { Comment, Post } = require("../models/PostModel");
const User = require("../models/UserModel");

const allPost = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find({ user: userId })
        .populate("user", "name avatar")
        .populate("comments");

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: posts,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const addPost = async (userId, content, media) => {
  return new Promise(async (resolve, reject) => {
    try {
      let post = await Post.create({
        user: userId,
        content,
        media,
      });
      post = await post.populate("user", "name avatar");
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: post,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const allComments = async (postId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comments = await Comment.find({ post: postId })
        .populate("user", "name avatar")
        .populate({
          path: "post",
          populate: {
            path: "user",
            select: "name avatar",
          },
        });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: comments,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const addComment = async (userId, content, postId) => {
  return new Promise(async (resolve, reject) => {
    const post = await Post.findById(postId);

    if (!post) {
      reject(new Error("Post not found"));
    }
    try {
      let comment = await Comment.create({
        user: userId,
        content,
        post: postId,
      });
      comment = await comment.populate("user", "name avatar");
      comment = await User.populate(comment, {
        path: "post.user",
        select: "name avatar",
      });

      post.comments.push(comment);
      await post.save();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: comment,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  addPost,
  allPost,
  allComments,
  addComment,
};
