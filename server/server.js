const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./db");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

// Start the server after connecting to the database
connectDB();

// Handle server termination gracefully
process.on("SIGINT", () => {
  console.log("Server shutting down...");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0); // Exit the process when MongoDB connection is closed
  });
});
