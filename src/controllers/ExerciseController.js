const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const Exercise = require("../models/ExcerciseModel");
const ExerciseService = require("../services/ExerciseService");
//@description     Post a new exercise
//@route           POST /api/exercise/create-exercise
//@access          Protected
const createExercise = asyncHandler(async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !description || !questions) {
      return res.status(400).json({
        status: "ERR",
        message: "All fields are required",
      });
    }
    const response = await ExerciseService.createExercise(req.body);
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get all exercise
//@route           GET /api/exercise/
//@access          Protected
const getAllExercise = asyncHandler(async (req, res) => {
  try {
    const response = await ExerciseService.getAllExercise();
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get details exercise
//@route           GET /api/exercise/:exerciseId
//@access          Protected
const getDetailsExercise = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId;
  if (!exerciseId) {
    return res.status(400).json({
      status: "ERR",
      message: "exerciseId is required",
    });
  }
  try {
    const response = await ExerciseService.getDetailsExercise(exerciseId);
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get all exercise
//@route           GET /api/exercise/:exerciseId
//@access          Protected
const getQuestionOfExercise = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId;
  if (!exerciseId) {
    return res.status(400).json({
      status: "ERR",
      message: "exerciseId is required",
    });
  }
  try {
    const response = await ExerciseService.getQuestionOfExercise(exerciseId);
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     update an exercise
//@route           PUT /api/exercise/:exerciseId
//@access          Protected

const updateExercise = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId;
  const { title, description, questions } = req.body;
  if (!exerciseId) {
    return res.status(400).json({
      status: "ERR",
      message: "exerciseId is required",
    });
  }
  try {
    const response = await ExerciseService.updateExercise(exerciseId, req.body);
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Delete an exercise
//@route           DELETE /api/exercise/:exerciseId
//@access          Protected

const deleteExercise = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId;
  if (!exerciseId) {
    return res.status(400).json({
      status: "ERR",
      message: "exerciseId is required",
    });
  }
  try {
    const response = await ExerciseService.deleteExercise(exerciseId);
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const checkAnswer = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId;
  const answer = req.body;
  if (!exerciseId) {
    return res.status(400).json({
      status: "ERR",
      message: "exerciseId is required",
    });
  }
  try {
    const response = await ExerciseService.checkAnswer(exerciseId, answer);
    return res.status(200).json(response);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  createExercise,
  getAllExercise,
  getDetailsExercise,
  getQuestionOfExercise,
  updateExercise,
  deleteExercise,
  checkAnswer,
};
