const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  startTime: { type: Date },
  endTime: { type: Date },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  comments: [{
    text: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);

