const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
