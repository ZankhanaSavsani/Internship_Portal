const logger = require("../utils/logger");
const SummerInternshipCompletionStatus = require("../models/SummerInternshipCompletion");

// Create a new internship completion status
exports.createInternshipCompletionStatus = async (req, res) => {
  try {
    const newStatus = await SummerInternshipCompletionStatus.create(req.body);
    res.status(201).json(newStatus);
  } catch (error) {
    next(error);
  }
};

// Get all internship completion statuses
exports.getAllInternshipCompletionStatuses = async (req, res, next) => {
  try {
    // Extract page and limit from query params, defaulting to page 1 and 10 items per page
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit; // Skip records based on current page

    // Find internship completion statuses with pagination
    const statuses = await SummerInternshipCompletionStatus.find()
      .populate("student", "name email") // Optionally populate student data
      .skip(skip) // Skip the records based on the current page
      .limit(limit); // Limit the number of records returned

    // Get the total number of records in the collection
    const total = await SummerInternshipCompletionStatus.countDocuments();

    // Respond with paginated data
    res.status(200).json({
      total, // Total number of records in the collection
      page, // Current page
      pages: Math.ceil(total / limit), // Total number of pages
      data: statuses, // The data for the current page
    });
  } catch (error) {
    next(error); // Forward any errors to the centralized error handler
  }
};

// Get a specific internship completion status by ID
exports.getInternshipCompletionStatusById = async (req, res) => {
  try {
    const status = await SummerInternshipCompletionStatus.findById(
      req.params.id
    )
      .populate("student", "name email")
      .populate("company", "companyName companyAddress");

    if (!status) {
      return res.status(404).json({ message: "Internship status not found" });
    }

    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

// Update an internship completion status by ID
exports.updateInternshipCompletionStatus = async (req, res) => {
  try {
    const updatedStatus =
      await SummerInternshipCompletionStatus.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

    if (!updatedStatus) {
      return res.status(404).json({ message: "Internship status not found" });
    }

    res.status(200).json(updatedStatus);
  } catch (error) {
    next(error);
  }
};

// Delete an internship completion status by ID
exports.deleteInternshipCompletionStatus = async (req, res) => {
  try {
    const deletedStatus =
      await SummerInternshipCompletionStatus.findByIdAndDelete(req.params.id);

    if (!deletedStatus) {
      return res.status(404).json({ message: "Internship status not found" });
    }

    res.status(200).json({ message: "Internship status deleted successfully" });
  } catch (error) {
    next(error);
  }
};
