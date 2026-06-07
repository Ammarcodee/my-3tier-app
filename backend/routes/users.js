const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET api/users
// @desc    Get all users (team members)
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

