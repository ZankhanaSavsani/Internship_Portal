const { check, validationResult } = require("express-validator");

const validateInternshipStatus = [
  check("student").trim().notEmpty().withMessage("Student ID is required"),

  check("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required"),

  check("companyWebsite")
    .trim()
    .notEmpty()
    .withMessage("Company website is required"),

  check("companyAddress")
    .trim()
    .notEmpty()
    .withMessage("Company address is required"),

  check("companyCity")
    .trim()
    .notEmpty()
    .withMessage("Company city is required"),

  check("typeOfInternship")
    .trim()
    .isIn([
      "Development Project",
      "Inhouse/Research Project",
      "On Technology Training",
    ])
    .withMessage(
      "Invalid type of internship. Must be one of: Development Project, Inhouse/Research Project, On Technology Training"
    ),

  check("technologies")
    .custom((value) => {
      if (typeof value === "string") {
        return value.split(",").map((tech) => tech.trim()); // Convert comma-separated string to array
      }
      return Array.isArray(value); // Ensure it's an array
    })
    .withMessage("Technologies must be an array or a comma-separated string"),

  check("technologiesDetails")
    .trim()
    .notEmpty()
    .withMessage("Technologies details are required"),

  check("modeOfInternship")
    .trim()
    .isIn(["Offline", "Online", "Hybrid"])
    .withMessage(
      "Invalid mode of internship. Must be one of: Offline, Online, Hybrid"
    ),

  check("hrDetails.name").trim().notEmpty().withMessage("HR name is required"),

  check("hrDetails.contactNo")
    .trim()
    .notEmpty()
    .withMessage("HR contact number is required"),

  check("hrDetails.email")
    .trim()
    .isEmail()
    .withMessage("Invalid HR email format"),

  check("stipendAmount")
    .isFloat({ min: 0 })
    .withMessage("Stipend amount must be a positive number"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Log the received values for debugging
      console.log("Received values:", req.body);

      return res.status(400).json({
        errors: errors.array().map((error) => ({
          ...error,
          receivedValue: req.body[error.path], // Include the received value in the error
        })),
      });
    }
    next();
  },
];

module.exports = { validateInternshipStatus };