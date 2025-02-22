const { check, validationResult } = require("express-validator");

const validateInternshipCompletionStatus = [
  check("student")
    .trim()
    .notEmpty()
    .withMessage("Student ID is required"),

  check("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required"),

  check("companyAddress")
    .trim()
    .notEmpty()
    .withMessage("Company address is required"),

  check("typeOfInternship")
    .trim()
    .customSanitizer(value => value?.trim())
    .isIn(["Development Project", "Inhouse/Research Project", "On Technology Training"])
    .withMessage("Invalid internship type. Must be one of: Development Project, Inhouse/Research Project, On Technology Training"),

  check("technologies")
    .trim()
    .custom((value) => {
      if (typeof value === "string") {
        return value.split(",").map((tech) => tech.trim());
      }
      return Array.isArray(value);
    })
    .withMessage("Technologies must be an array or a comma-separated string"),

  check("modeOfInternship")
    .trim()
    .customSanitizer(value => value?.trim())
    .isIn(["Offline", "Online", "Hybrid"])
    .withMessage("Invalid mode of internship. Must be one of: Offline, Online, Hybrid"),

  check("startDate")
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Start date must be in YYYY-MM-DD format"),

  check("endDate")
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("End date must be in YYYY-MM-DD format"),

  check("stipendAmount")
    .trim()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Stipend amount must be a positive number"),

  // Middleware to handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Log the received values for debugging
      console.log('Received values:', req.body);
      
      return res.status(400).json({
        errors: errors.array().map(error => ({
          ...error,
          receivedValue: req.body[error.path] // Include the received value in the error
        }))
      });
    }
    next();
  }
];

module.exports = validateInternshipCompletionStatus;