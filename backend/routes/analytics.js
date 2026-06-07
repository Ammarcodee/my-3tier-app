const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");

// @route   GET api/analytics
// @desc    Get dashboard analytics and activity logs
router.get("/", auth, async (req, res) => {
  try {
    // Basic stats
    const totalTasks = await Task.countDocuments({ $or: [{ author: req.user.id }, { assignee: req.user.id }] });
    const completedTasks = await Task.countDocuments({ status: "Completed", $or: [{ author: req.user.id }, { assignee: req.user.id }] });
    
    // User productivity (tasks completed per user)
    // This is a simple version, ideally we'd aggregate over all team tasks if the user is in teams
    const userProductivity = await Task.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: "$assignee", count: { $sum: 1 } } }
    ]);
    
    // Populate user names for productivity
    const populatedProductivity = await User.populate(userProductivity, { path: "_id", select: "name" });

    // Recent activity logs
    const recentLogs = await ActivityLog.find()
      .populate("user", "name")
      .populate("task", "title")
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({
      stats: {
        total: totalTasks,
        completed: completedTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      },
      productivity: populatedProductivity.map(p => ({
        name: p._id ? p._id.name : "Unassigned",
        tasksCompleted: p.count
      })),
      activityLogs: recentLogs
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

