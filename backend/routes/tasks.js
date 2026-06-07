const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");

// @route   GET api/tasks
// @desc    Get all tasks for a user
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      $or: [{ author: req.user.id }, { assignee: req.user.id }] 
    }).populate("assignee author", "name email").sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// @route   POST api/tasks
// @desc    Create a task
router.post("/", auth, async (req, res) => {
  const { title, description, priority, dueDate, assignee } = req.body;
  try {
    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      assignee,
      author: req.user.id
    });
    const savedTask = await newTask.save();
    
    // Log activity
    const log = new ActivityLog({
      action: "CREATE_TASK",
      user: req.user.id,
      task: savedTask._id,
      details: `Created task: ${title}`
    });
    await log.save();

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});

// @route   PATCH api/tasks/:id
// @desc    Update task status/info
router.patch("/:id", auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Update fields
    const updates = req.body;
    Object.keys(updates).forEach(key => task[key] = updates[key]);
    await task.save();

    // Log activity
    const log = new ActivityLog({
      action: "UPDATE_TASK",
      user: req.user.id,
      task: task._id,
      details: `Updated task: ${task.title}`
    });
    await log.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    await Task.findByIdAndDelete(req.params.id);

    // Log activity
    const log = new ActivityLog({
      action: "DELETE_TASK",
      user: req.user.id,
      details: `Deleted task: ${task.title}`
    });
    await log.save();

    res.json({ message: "Task removed" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});

module.exports = router;

