const express = require("express");
const {
  createWeeklyReport,
  getAllWeeklyReports,
  getWeeklyReportById,
  updateWeeklyReport,
  deleteWeeklyReport,
} = require("../controllers/WeeklyReportController");

const validateReport = require("../middleware/validateWeeklyReport");

const router = express.Router();

// Routes
router.post("/", validateReport, createWeeklyReport);
router.get("/", getAllWeeklyReports);
router.get("/:id", getWeeklyReportById);
router.put("/:id", validateReport, updateWeeklyReport);
router.delete("/:id", deleteWeeklyReport);

module.exports = router;
