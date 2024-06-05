const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    birthDate: { type: Date, required: false },
    profession: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    phone: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    posts: { type: Number, default: 0 },
    notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
    level: { type: Number, default: 0 },
    exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
    schedule: [{ type: String }],
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
