// internshipStatusMiddleware.js

const { check, validationResult } = require("express-validator");

const validateInternshipStatus = [
  check("student").notEmpty().withMessage("Student ID is required"),
  check("companyName").notEmpty().withMessage("Company name is required"),
  check("companyWebsite").notEmpty().withMessage("Company website is required"),
  check("companyAddress").notEmpty().withMessage("Company address is required"),
  check("companyCity").notEmpty().withMessage("Company city is required"),
  check("typeOfInternship")
    .isIn([
      "Development Project",
      "Inhouse/Research Project",
      "On Technology Training",
    ])
    .withMessage("Invalid type of internship"),
  check("technologies").isArray().withMessage("Technologies must be an array"),
  check("technologiesDetails")
    .notEmpty()
    .withMessage("Technologies details are required"),
  check("modeOfInternship")
    .isIn(["Offline", "Online", "Hybrid"])
    .withMessage("Invalid mode of internship"),
  check("hrDetails.name").notEmpty().withMessage("HR name is required"),
  check("hrDetails.contactNo")
    .notEmpty()
    .withMessage("HR contact number is required"),
  check("hrDetails.email").isEmail().withMessage("Invalid HR email format"),
  check("stipendAmount")
    .isFloat({ min: 0 })
    .withMessage("Stipend amount must be a positive number"),
  check("offerLetter").notEmpty().withMessage("Offer letter is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateInternshipStatus };
