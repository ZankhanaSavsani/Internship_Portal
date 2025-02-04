const { check, validationResult } = require("express-validator");

// Middleware for validating company approval inputs
const validateCompanyApproval = [
  check("student").notEmpty().withMessage("Student ID is required"),
  check("studentName").notEmpty().withMessage("Student name is required"),
  check("companyName").notEmpty().withMessage("Company name is required"),
  check("companyAddress").notEmpty().withMessage("Company address is required"),
  check("stipendAmount")
    .isFloat({ min: 0 })
    .withMessage("Stipend amount must be a positive number"),
  check("hrDetails.name").notEmpty().withMessage("HR name is required"),
  check("hrDetails.phone")
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  check("hrDetails.email").isEmail().withMessage("Invalid email format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateCompanyApproval;
