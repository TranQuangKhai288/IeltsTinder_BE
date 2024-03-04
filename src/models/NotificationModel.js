const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  type: { type: String, required: true }, // friendRequest, exerciseCompleted, etc.
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
