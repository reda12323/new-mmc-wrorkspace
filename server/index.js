require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" })
);
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Workspace API is running!" });
});

// Routes
app.use("/api/auth", require("./routes/AuthRoutes"));

// MongoDB connection (the URI now lives in .env, not in the code)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((error) => console.error("MongoDB connection error:", error.message));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});