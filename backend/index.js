// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const podcastRoutes = require("./routes/podcastRoutes");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow your frontend origins
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/user", userRoutes);
app.use("/podcasts", podcastRoutes); // Use podcast routes

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    statusCode,
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.mongodb_url, {})
  .then(() => {
    console.log("Connected with Database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

// Start the server
app.listen(3000, () => {
  console.log(`Server running on port 3000!`);
});
