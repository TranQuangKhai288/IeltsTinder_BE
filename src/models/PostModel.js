const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Định nghĩa schema cho hình ảnh và video
const mediaSchema = new Schema(
  {
    type: { type: String, enum: ["image", "video", "audio"], required: true }, // Loại của phương tiện: hình ảnh hoặc video
    uri: { type: String, required: true }, // URL hoặc đường dẫn đến phương tiện
  },
  { _id: false } // Không cần ID riêng cho mỗi phương tiện
);

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến người dùng bình luận
  content: { type: String, required: true }, // Nội dung của bình luận
  media: [mediaSchema], // Mảng chứa các hình ảnh và video
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo bình luận
});

// Định nghĩa schema cho bài viết
const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến người dùng đăng bài
    content: { type: String, required: true }, // Nội dung của bài viết
    media: [mediaSchema], // Mảng chứa các hình ảnh và video
    postedAt: { type: Date, default: Date.now }, // Thời gian người dùng đăng bài
    comments: [commentSchema], // Mảng chứa các bình luận
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Mảng chứa ID của người dùng đã like bài viết
  },
  {
    timestamps: true, // Tự động tạo các trường createdAt và updatedAt
  }
);

module.exports = {
  Media: mongoose.model("Media", mediaSchema),
  Comment: mongoose.model("Comment", commentSchema),
  Post: mongoose.model("Post", postSchema),
};
