const { Comment, Post, Media } = require("../models/PostModel");
const User = require("../models/UserModel");

const allPostOfAUser = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find({ user: userId })
        .populate({
          path: "user",
          select: "name",
        })
        .populate({
          path: "media",
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
      const numberofPost = await Post.find({ user: userId }).countDocuments();
      user.posts = numberofPost;
      //user.posts = user.posts ? user.posts + 1 : user.posts;
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
    try {
      const post = await Post.findById(postId);

      if (!post) {
        return resolve({
          status: "ERR",
          message: "Post not found",
        });
      }

      const createdMedia = [];

      if (media) {
        for (const m of media) {
          const newMedia = await Media.create(m);
          createdMedia.push(newMedia._id);
        }
      }

      const comment = await Comment.create({
        user: userId,
        content,
        post: postId,
        media: createdMedia,
      });

      const commentData = await Comment.findById(comment._id)
        .populate("user", "name avatar")
        .populate("media");

      const countComment = await Comment.countDocuments({ post: postId });

      post.countComment = countComment;
      await post.save();

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: commentData,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const allPost = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find()
        .populate({
          path: "user",
          select: "name avatar",
        })
        .populate({
          path: "media",
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

const putLike = async (userId, postId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        resolve({
          status: "ERR",
          message: "Post not found",
        });
        return;
      }

      post.countLike = post.countLike ? post.countLike + 1 : 1;

      await post.save();
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

const deleteLike = async (userId, postId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        resolve({
          status: "ERR",
          message: "Post not found",
        });
        return;
      }

      post.countLike = post.countLike ? post.countLike - 1 : 0;

      await post.save();
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

module.exports = {
  addPost,
  allPostOfAUser,
  allComments,
  addComment,
  allPost,
  putLike,
  deleteLike,
};
