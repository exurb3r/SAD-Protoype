const UserGameDetails = require("../../models/user_models/UserGameDetails");
const UserProgress = require("../../models/user_models/UserProgress");
const UserRoutine = require("../../models/user_models/UserRoutine");

const addRoutine = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routineName, exercises, dayAssigned, timeAssigned } = req.body;

    if (!routineName || !exercises) {
      return res.status(400).json({ message: "Missing routine data" });
    }

    let userRoutine = await UserRoutine.findOne({ userId: userId });

    if (!userRoutine) {
      userRoutine = new UserRoutine({
        userId,
        routines: []
      });
    }

    userRoutine.routines.push({
      routineName,
      exercises,
      dayAssigned,
      timeAssigned
    });

    await userRoutine.save();

    res.status(201).json({
      message: "Routine added successfully",
      routines: userRoutine.routines
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRoutine = async (req, res) => {
  try {
    const userId = req.user.id;
    let userRoutine = await UserRoutine.findOne({ userId: userId });

    if (!userRoutine) {
      userRoutine = new UserRoutine({
        userId,
        routines: []
      });
    }

    const routines = userRoutine.routines;

    res.status(201).json({
      message: "Routine retrieved successfully",
      routines: routines
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteRoutine = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routineId } = req.body;
    let userRoutine = await UserRoutine.findOne({ userId: userId });
    if (!userRoutine) {
      return res.status(404).json({ message: "No routines found for user" });
    }

    userRoutine.routines = userRoutine.routines.filter(
        (routine) => routine._id.toString() !== routineId
    );

    await userRoutine.save();

    res.status(201).json({
      message: "Routine deleted successfully",
      routines: userRoutine.routines
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getIndividualRoutine = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routineId } = req.params;

    const userRoutine = await UserRoutine.findOne({ userId });

    if (!userRoutine || !userRoutine.routines?.length) {
      return res.status(404).json({ message: "No routines found for user" });
    }

    const routine = userRoutine.routines.find(
      r => r._id.toString() === routineId
    );

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    res.status(200).json({
      message: "Routine retrieved successfully",
      routine
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const updateIndividualRoutine = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routineId } = req.params;
    const { routineName, exercises, dayAssigned, timeAssigned } = req.body;

    if (!routineName || !exercises || exercises.length === 0) {
      return res.status(400).json({ message: "Missing routine data" });
    }

    const userRoutine = await UserRoutine.findOne({ userId });

    if (!userRoutine) {
      return res.status(404).json({ message: "No routines found" });
    }

    const routineIndex = userRoutine.routines.findIndex(
      r => r._id.toString() === routineId
    );

    if (routineIndex === -1) {
      return res.status(404).json({ message: "Routine not found" });
    }

    userRoutine.routines[routineIndex].routineName = routineName;
    userRoutine.routines[routineIndex].exercises = exercises;
    userRoutine.routines[routineIndex].dayAssigned = dayAssigned;
    userRoutine.routines[routineIndex].timeAssigned = timeAssigned;

    await userRoutine.save();

    res.status(200).json({
      message: "Routine updated successfully",
      routine: userRoutine.routines[routineIndex]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addRoutine, getRoutine, deleteRoutine, getIndividualRoutine, updateIndividualRoutine };