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

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/users", require("./routes/users"));
app.use("/api/teams", require("./routes/teams"));
app.use("/api/analytics", require("./routes/analytics"));

app.get("/health", (req, res) => res.json({ status: "UP" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // Server is running
});

