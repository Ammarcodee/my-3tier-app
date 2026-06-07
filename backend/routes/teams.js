const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Team = require("../models/Team");
const User = require("../models/User");

// @route   POST api/teams
// @desc    Create a team
router.post("/", auth, async (req, res) => {
  const { name } = req.body;
  try {
    const newTeam = new Team({
      name,
      admin: req.user.id,
      members: [req.user.id]
    });
    const team = await newTeam.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ error: "Team creation failed" });
  }
});

// @route   GET api/teams/my
// @desc    Get teams for current user
router.get("/my", auth, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user.id }).populate("members", "name email");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// @route   POST api/teams/:id/members
// @desc    Add member to team
router.post("/:id/members", auth, async (req, res) => {
  const { email } = req.body;
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });

    // Only admin can add members
    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ error: "User not found" });

    if (team.members.includes(userToAdd._id)) {
      return res.status(400).json({ error: "User already in team" });
    }

    team.members.push(userToAdd._id);
    await team.save();

    res.json(team);
  } catch (err) {
    res.status(400).json({ error: "Add member failed" });
  }
});

// @route   GET api/teams/:id/members
// @desc    Get team members
router.get("/:id/members", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("members", "name email role");
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json(team.members);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

