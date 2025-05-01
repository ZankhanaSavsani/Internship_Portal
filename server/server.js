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

// Trust proxy (important for hosted platforms)
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "https://internship-portal-37n9.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove any undefined values

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
    // Allow requests with no origin (like mobile apps or curl requests)
    // if (!origin) return callback(null, true);

    // if (
    //   allowedOrigins.includes(origin) ||
    //   origin.includes("vercel.app") || // Allows all Vercel preview deployments
    //   origin.match(/\.vercel\.app$/) || // Allows *.vercel.app domains
    //   origin.match(/localhost(:\d+)?$/)
    // ) {
    //   // Allows localhost on any port
    //   return callback(null, true);
    // }

    // return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
  ],
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
  maxAge: 86400, // Preflight cache for 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicit OPTIONS handler for all routes
app.options("*", cors(corsOptions)); // Important for preflight

app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      success: false,
      message: 'CORS rejected',
      allowedOrigins: allowedOrigins,
      yourOrigin: req.headers.origin 
    });
  }
  next(err);
});

// ▼▼▼ Add the debugging middleware here ▼▼▼
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log("\n=== CORS Debug ===");
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log("Origin:", req.headers.origin);
    console.log("Headers:", req.headers);

    // Log CORS-related response headers
    const corsHeaders = {
      ACAO: res.getHeader("Access-Control-Allow-Origin"),
      ACAC: res.getHeader("Access-Control-Allow-Credentials"),
      ACAM: res.getHeader("Access-Control-Allow-Methods"),
      ACAH: res.getHeader("Access-Control-Allow-Headers"),
    };
    console.log("CORS Response Headers:", corsHeaders);

    // Special handling for OPTIONS (preflight) requests
    if (req.method === "OPTIONS") {
      console.log("PREFLIGHT REQUEST DETECTED");
    }
    console.log("===\n");
    next();
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); //  Parse cookies

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Add headers for all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Import Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const guideRoutes = require("./routes/guideRoutes");
const adminRoutes = require("./routes/adminRoutes");
const companyApprovalRoutes = require("./routes/companyApprovalRoutes");
const summerInternshipCompletionRoutes = require("./routes/summerInternshipCompletionRoutes");
const summerInternshipStatusRoutes = require("./routes/summerInternshipStatusRoutes");
const weeklyReportRoutes = require("./routes/weeklyReportRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const guideAllocationRoutes = require("./routes/guideAllocationRoutes");
const studentInternshipRoutes = require("./routes/studentInternshipRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/guide", guideRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company-approvals", companyApprovalRoutes);
app.use("/api/summer-internship-status", summerInternshipStatusRoutes);
app.use("/api/summer-internship-completion", summerInternshipCompletionRoutes);
app.use("/api/weeklyReport", weeklyReportRoutes);
app.use("/api/studentInternship", studentInternshipRoutes);
app.use("/api", downloadRoutes);
app.use("/api", uploadRoutes);
app.use("/api/guide-allocation", guideAllocationRoutes);
app.use("/api/notifications", notificationRoutes);

// Add a base route to confirm backend is running
app.get("/", (req, res) => {
  res.send("✅ Internship Portal Backend is running");
});

// Silently handle favicon.ico requests to avoid 404s in the browser
app.get("/favicon.ico", (req, res) => res.status(204).end());

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
