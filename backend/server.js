const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/taskdb";

mongoose.connect(MONGO_URI)
  .then(() => {
    // MongoDB Connected
  })
  .catch(() => {
    // MongoDB Error
  });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model("Task", taskSchema);

// GET all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// CREATE task
app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: "Bad Request" });
  }
});

// UPDATE status
app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Not Found" });
    }
    task.status = task.status === "Pending" ? "Completed" : "Pending";
    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (err) {
    return res.status(400).json({ error: "Update failed" });
  }
});

// DELETE task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});

app.get("/health", (req, res) => res.json({ status: "UP" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // Listen active
});

