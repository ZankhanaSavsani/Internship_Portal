const logger = require("../utils/logger");
const { uploadFileToDrive, deleteLocalFile } = require("../utils/googleDriveUtils");
const SummerInternshipCompletionStatus = require("../models/SummerInternshipCompletionFormModel");


// @desc   Get all internship completion statuses (excluding soft-deleted records)
// @route  GET /api/summer-internships-completion
exports.getAllInternshipCompletionStatuses = async (req, res, next) => {
  try {
    // Extract page and limit from query params, defaulting to page 1 and 10 items per page
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit; 

    // Dynamic sorting
    const sortField = req.query.sortBy || "createdAt"; 
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    const sortOptions = { [sortField]: sortOrder };

    // Dynamic filtering based on query params
    const filterOptions = { isDeleted: false }; // Exclude soft-deleted records
    if (req.query.companyName) {
      filterOptions.companyName = { $regex: req.query.companyName, $options: "i" };
    }
    if (req.query.studentName) {
      filterOptions.studentName = { $regex: req.query.studentName, $options: "i" };
    }

    // Fetch internship completion statuses with pagination, sorting, and filtering
    const statuses = await SummerInternshipCompletionStatus.find(filterOptions)
      .populate("student", "name email")
      .populate("company", "companyName companyAddress")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get the total number of matching records (excluding soft-deleted ones)
    const total = await SummerInternshipCompletionStatus.countDocuments(filterOptions);

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: statuses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get a specific internship completion status by ID (excluding soft-deleted records)
// @route  GET /api/summer-internships-completion/:id
exports.getInternshipCompletionStatusById = async (req, res, next) => {
  try {
    const status = await SummerInternshipCompletionStatus.findById(req.params.id)
      .populate("student", "name email")
      .populate("company", "companyName companyAddress");

    if (!status || status.isDeleted) {
      return res.status(404).json({ message: "Internship status not found" });
    }

    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

// @desc   Create a new internship completion status
// @route  POST /api/summer-internships-completion
exports.createInternshipCompletionStatus = async (req, res, next) => {
  try {
    const { files } = req;
    let internshipData = { ...req.body };

    // Check if completion certificate is provided (required)
    if (!files?.completionCertificate?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Completion certificate is required"
      });
    }

    // Upload completion certificate to Google Drive
    try {
      const completionCertificateUrl = await uploadFileToDrive(
        files.completionCertificate[0],
        process.env.GOOGLE_DRIVE_FOLDER_ID
      );
      internshipData.completionCertificate = completionCertificateUrl;
      
      // Delete local file after upload
      await deleteLocalFile(files.completionCertificate[0].path);
    } catch (error) {
      logger.error('Error uploading completion certificate:', error);
      return res.status(500).json({
        success: false,
        message: "Error uploading completion certificate"
      });
    }

    // Upload stipend proof if provided (optional)
    if (files?.stipendProof?.[0]) {
      try {
        const stipendProofUrl = await uploadFileToDrive(
          files.stipendProof[0],
          process.env.GOOGLE_DRIVE_FOLDER_ID
        );
        internshipData.stipendProof = stipendProofUrl;
        
        // Delete local file after upload
        await deleteLocalFile(files.stipendProof[0].path);
      } catch (error) {
        logger.error('Error uploading stipend proof:', error);
        return res.status(500).json({
          success: false,
          message: "Error uploading stipend proof"
        });
      }
    }

    // Create the internship completion status in database
    const newStatus = await SummerInternshipCompletionStatus.create(internshipData);

    // Log success
    logger.info(`New internship completion status created: ${newStatus._id}`);

    // Send response
    res.status(201).json({
      success: true,
      data: newStatus,
    });

  } catch (error) {
    // If any error occurs, make sure to clean up any uploaded files
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (file.path) {
            deleteLocalFile(file.path);
          }
        });
      });
    }
    next(error);
  }
};

// @desc   Update an internship completion status by ID
// @route  PUT /api/summer-internships-completion/:id
exports.updateInternshipCompletionStatus = async (req, res, next) => {
  try {
    const updatedStatus = await SummerInternshipCompletionStatus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStatus || updatedStatus.isDeleted) {
      return res.status(404).json({ message: "Internship status not found" });
    }

    logger.info(`Internship completion status updated: ${updatedStatus._id}`);
    res.status(200).json(updatedStatus);
  } catch (error) {
    next(error);
  }
};

// @desc   Soft delete an internship completion status
// @route  DELETE /api/summer-internships-completion/:id
exports.deleteInternshipCompletionStatus = async (req, res, next) => {
  try {
    const status = await SummerInternshipCompletionStatus.findById(req.params.id);

    if (!status || status.isDeleted) {
      return res.status(404).json({ message: "Internship status not found or already deleted" });
    }

    status.isDeleted = true;
    status.deletedAt = new Date();
    await status.save();

    logger.info(`Internship completion status soft deleted: ${status._id}`);
    res.status(200).json({ message: "Internship status deleted successfully" });
  } catch (error) {
    next(error);
  }
};
