const { check, validationResult } = require("express-validator");

// Custom phone number validator
const validatePhoneNumber = (value) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/; // Allows optional + and 10+ digits
  if (!phoneRegex.test(value)) {
    throw new Error("Invalid phone number");
  }
  return true;
};

// Middleware for validating company approval inputs
const validateCompanyApproval = [
  check("student").notEmpty().withMessage("Student ID is required"),
  check("studentName").notEmpty().withMessage("Student name is required"),
  check("companyName").notEmpty().withMessage("Company name is required"),
  check("companyAddress").notEmpty().withMessage("Company address is required"),
  check("stipendAmount")
    .toFloat() // Convert to a number
    .isFloat({ min: 0 })
    .withMessage("Stipend amount must be a positive number"),
  check("hrDetails").exists().withMessage("HR details are required"),
  check("hrDetails.name").notEmpty().withMessage("HR name is required"),
  check("hrDetails.phone")
    .custom(validatePhoneNumber) // Use custom validator
    .withMessage("Invalid phone number"),
  check("hrDetails.email").isEmail().withMessage("Invalid email format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }
    next();
  },
];

module.exports = validateCompanyApproval;