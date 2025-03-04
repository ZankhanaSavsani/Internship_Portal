const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.set('trust proxy', true);

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials (e.g., cookies)
}));

// Import Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const guideRoutes = require("./routes/guideRoutes");
const adminRoutes = require("./routes/adminRoutes");
const companyApprovalRoutes = require("./routes/companyApprovalRoutes");
const summerInternshipCompletionRoutes = require("./routes/summerInternshipCompletionRoutes");
const summerInternshipStatusRoutes = require("./routes/summerInternshipStatusRoutes");
const weeklyReportRoutes = require("./routes/weeklyReportRoutes");
const downloadRoutes = require('./routes/downloadRoutes');
const uploadRoutes = require("./routes/uploadRoutes");


// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/guide",guideRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/company-approvals", companyApprovalRoutes);
app.use("/api/summer-internship-status", summerInternshipStatusRoutes);
app.use("/api/internship-completion", summerInternshipCompletionRoutes);
app.use("/api/weeklyReport", weeklyReportRoutes);
app.use('/api', downloadRoutes);
app.use("/api", uploadRoutes);


// Error handler 
app.use(errorHandler);

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle server termination gracefully
process.on("SIGINT", () => {
  console.log("Server shutting down...");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0); // Exit the process when MongoDB connection is closed
  });
});
