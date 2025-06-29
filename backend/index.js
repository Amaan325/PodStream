// server.js or index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const commentRoutes = require("./routes/commentRoutes");

require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const favoritesRoutes = require("./routes/favoriteRoutes");
const podcastRoutes = require("./routes/podcastRoutes");
const reportRoutes = require("./routes/reportRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(
  cors({
    origin:  "http://localhost:5173" , 
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/", require("./routes/downloadRoute"));

app.use("/user/favorites", favoritesRoutes);
app.use("/user", userRoutes);
app.use("/podcasts", podcastRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", commentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    statusCode,
  });
});

// DB Connection
mongoose
  .connect(process.env.mongodb_url, {})
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("Error connecting to DB:", err));

// Start server
const server = app.listen(3000, () => {
  console.log("Server running on port 3000!");
});

// 🔥 Initialize Socket.IO
const socket = require("./socket");
socket.init(server);
