const Question = require("../models/QuestionModel");
const Exercise = require("../models/ExcerciseModel");

const createExercise = async (newExercise) => {
  return new Promise(async (resolve, reject) => {
    const { title, description, questions } = newExercise;
    try {
      const checkExercise = await Exercise.findOne({
        title,
      });
      if (checkExercise !== null) {
        resolve({
          status: "ERR",
          message: "this exercise title already exists",
          data: exercise,
        });
        return;
      }
      const exercise = new Exercise({
        title,
        description,
        questions: [], //questions will be an array of objects
      });

      await exercise.save();

      // Add questions to the exercise
      for (const questionData of questions) {
        const { type, question, media, options, correctOption } = questionData;
        const newQuestion = new Question({
          exerciseId: exercise._id,
          type,
          question,
          media,
          options,
          correctOption,
        });
        await newQuestion.save();
        exercise.questions.push(newQuestion._id);
      }
      await exercise.save();

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: exercise,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllExercise = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const exercises = await Exercise.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: exercises,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsExercise = async (exerciseId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const exercises = await Exercise.findById(exerciseId);
      if (!exercises) {
        reject(new Error("Exercise not found"));
        return;
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: exercises,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getQuestionOfExercise = async (exerciseId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const exercises = await Exercise.findById(exerciseId);
      if (!exercises) {
        reject(new Error("Exercise not found"));
        return;
      }
      const questions = await Question.find({ exerciseId: exerciseId });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: questions,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getQuestionById = async (questionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const question = await Question.findById(questionId).populate(
        "exerciseId",
        "title"
      );
      if (!question) {
        reject(new Error("Question not found"));
        return;
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: question,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateExercise = async (exerciseId, newExercise) => {
  const { title, description, questions } = newExercise;
  console.log("newExercise", newExercise);
  return new Promise(async (resolve, reject) => {
    try {
      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) {
        reject(new Error("Exercise not found"));
        return;
      }

      if (title) {
        exercise.title = title;
      }
      if (description) {
        exercise.description = description;
      }
      if (questions && questions.length > 0) {
        exercise.questions = questions;
      }

      await exercise.save();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: exercise,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteExercise = async (exerciseId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Find the exercise by id
      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) {
        reject(new Error("Exercise not found"));
        return;
      }

      // Remove the exercise
      await exercise.remove();
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const checkAnswer = async (exerciseId, answer) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check is exist exercise
      const exercises = await Exercise.findById(exerciseId);
      if (!exercises) {
        reject(new Error("Exercise not found"));
        return;
      }
      // Find the questions by exerciseId
      const questions = await Question.find({ exerciseId: exerciseId });
      if (!questions) {
        reject(new Error("This exercise has no questions"));
        return;
      }
      // Check the answer
      let result = [];

      if (answer.length === 0) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: result,
        });
        return;
      }

      for (const question of questions) {
        // Check if there's an answer for this question
        const correspondingAnswer = answer.answer.find(
          (ans) => ans._id === question._id.toString()
        );
        if (!correspondingAnswer) {
          result.push({
            questionId: question._id,
            isCorrect: false, // No answer provided for this question
            correctIndex: question.correctOption,
          });
        } else {
          if (parseInt(correspondingAnswer.answer) === question.correctOption) {
            result.push({
              questionId: question._id,
              isCorrect: true,
              correctIndex: question.correctOption,
            });
          } else {
            result.push({
              questionId: question._id,
              isCorrect: false,
              correctIndex: question.correctOption,
            });
          }
        }
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: result,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAnswerForAQuestion = async (questionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const question = await Question.findById(questionId).populate(
        "exerciseId",
        "title"
      );
      if (!question) {
        reject(new Error("Question not found"));
        return;
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: question,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createExercise,
  getAllExercise,
  getDetailsExercise,
  getQuestionOfExercise,
  getQuestionById,
  getAnswerForAQuestion,
  updateExercise,
  deleteExercise,
  checkAnswer,
};
