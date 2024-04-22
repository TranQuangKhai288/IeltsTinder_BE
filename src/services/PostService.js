const { Comment, Post, Media } = require("../models/PostModel");
const User = require("../models/UserModel");

const allPost = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find({ user: userId })
        .populate({
          path: "user",
          select: "name",
        })
        .populate({
          path: "media",
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "name",
          },
        });

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
      const user = await User.findById(userId);
      if (!user) {
        reject(new Error("User not found"));
      }
      console.log(media, "media");
      console.log(content, "content");
      console.log(userId, "userId");

      const createdMedia = [];

      for (const m of media) {
        const newMedia = await Media.create(m);
        createdMedia.push(newMedia._id);
      }

      let post = await Post.create({
        user: userId,
        content: content,
        media: createdMedia,
      });
      // plus 1 post to user
      user.posts = user.posts ? user.posts + 1 : user.posts;
      post = await post.populate("user", "name");
      await user.save();
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
      const post = await Post.findById({ _id: postId });
      if (!post) {
        resolve({
          status: "ERR",
          message: "Post not found",
        });
        return;
      }

      const comments = await Comment.find({ post: postId })
        .populate("user", "name avatar")
        .populate("media");

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

const addComment = async (userId, content, postId, media) => {
  return new Promise(async (resolve, reject) => {
    const post = await Post.findById(postId);

    if (!post) {
      resolve({
        status: "ERR",
        message: "Post not found",
      });
    }

    const createdMedia = [];

    for (const m of media) {
      const newMedia = await Media.create(m);
      createdMedia.push(newMedia._id);
    }

    try {
      let comment = await Comment.create({
        user: userId,
        content,
        post: postId,
        media: createdMedia,
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
