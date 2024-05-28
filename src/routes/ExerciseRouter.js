const express = require("express");
const router = express.Router();
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleware");
const ExerciseController = require("../controllers/ExerciseController");

router.post(
  "/create-exercise",
  //authUserMiddleWare,
  ExerciseController.createExercise
);

router.get(
  "/get-all-exercise",
  //authMiddleWare,
  ExerciseController.getAllExercise
);

router.get(
  "/get-details-exercise/:exerciseId",
  //authMiddleWare,
  ExerciseController.getDetailsExercise
);

router.get(
  "/get-questions-exercise/:exerciseId",
  //authMiddleWare,
  ExerciseController.getQuestionOfExercise
);

router.get(
  "/get-a-questions/:questionId",
  //authMiddleWare,
  ExerciseController.getQuestionById
);

router.put(
  "/update-exercise/:exerciseId",
  //authMiddleWare,
  ExerciseController.updateExercise
);

//Khải chưa test API này. chắc là nó chạy(or not)
router.delete(
  "/delete-exercise/:exerciseId",
  //authMiddleWare,
  ExerciseController.deleteExercise
);

//check the correct answer of the question
router.post(
  "/check-answer/:exerciseId",
  //authMiddleWare,
  ExerciseController.checkAnswer
);

//get the correct answer of the question
router.get(
  "/get-answer-question/:questionId",
  //authMiddleWare,
  ExerciseController.getAnswerForAQuestion
);

module.exports = router;
