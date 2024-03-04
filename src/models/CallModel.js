const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const callSchema = new Schema({
  callerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  duration: { type: Number, required: true }, // Đơn vị: giây
  timestamp: { type: Date, default: Date.now },
});

const Call = mongoose.model("Call", callSchema);

module.exports = Call;
