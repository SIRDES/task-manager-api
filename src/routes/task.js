const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

const Task = require("../modal/task");

// Request for creating a new task
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    createdBy: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(error);
  }
});

// Get all post created by a user 
// Get /tasks?completed=true
// Get /tasks?limit=4&skip=2
// Get /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const match = {}
  const sort = {}
  if(req.query.completed){
    match.completed = req.query.completed.toLowerCase() === "true" 
  }
  if(req.query.sortBy){
    const part = req.query.sortBy.split(":")
    sort[part[0]] = part[1].toLowerCase() === "desc" ? -1: 1;
  }
  try {
    // console.log(req.user)
    // const tasks = await Task.find({createdBy: req.user._id});
    const tasks = await req.user.populate({
      path: "userTasks",
      match, //this is use to for making query
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    });
    // console.log(tasks.userTasks)
    res.send(tasks.userTasks);
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});

//Reading a single task
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById( _id );
    const task = await Task.findOne({ _id, createdBy: req.user._id });
    if (!task) {
      return res.status(404).send("No task found");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

// update a task
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid update fields" });
  }
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});
// Deleting a task
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!task) {
      res.status(404).send({ error: "Task not found" });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
