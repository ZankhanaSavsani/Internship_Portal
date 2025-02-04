const { check, validationResult } = require("express-validator");

const validateInternshipCompletionStatus = [
  check("student").notEmpty().withMessage("Student ID is required"),
  check("companyName").notEmpty().withMessage("Company name is required"),
  check("companyAddress").notEmpty().withMessage("Company address is required"),
  check("typeOfInternship").isIn([
    "Development Project",
    "Inhouse/Research Project",
    "On Technology Training",
  ]).withMessage("Invalid internship type"),
  check("technologies").isArray().withMessage("Technologies must be an array"),
  check("modeOfInternship").isIn(["Offline", "Online", "Hybrid"]).withMessage("Invalid mode of internship"),
  check("startDate").isDate().withMessage("Start date must be a valid date"),
  check("endDate").isDate().withMessage("End date must be a valid date"),
  check("stipendAmount").isFloat({ min: 0 }).withMessage("Stipend amount must be a positive number"),
  check("completionCertificate").notEmpty().withMessage("Completion certificate is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateInternshipCompletionStatus;
