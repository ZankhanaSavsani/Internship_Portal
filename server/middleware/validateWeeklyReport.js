const { body } = require("express-validator");

const validateReport = [
  body("student").notEmpty().withMessage("Student ID is required"),
  body("studentName").notEmpty().withMessage("Student Name is required"),
  body("projectTitle").notEmpty().withMessage("Project Title is required"),
  body("reportWeek").isInt({ min: 1, max: 4 }).withMessage("Report Week must be between 1 and 4"),
  body("reportWeekStart").isISO8601().withMessage("Valid start date required"),
  body("reportWeekEnd").isISO8601().withMessage("Valid end date required"),
];

module.exports = validateReport;
