const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Media } = require("./PostModel");
const questionSchema = new Schema({
  exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
  type: { type: String, enum: ["LISTENING", "READING"], required: true },
  question: { type: String, required: true },
  media: [Media.schema],
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
