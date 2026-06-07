const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);

