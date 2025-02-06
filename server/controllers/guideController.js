// controllers/guideController.js
const Guide = require("../models/GuideModel");
const logger = require("../utils/logger");

// @desc   Create a new guide
// @route  POST /api/guide
exports.createGuide = async (req, res, next) => {
  try {
    const { username, guideName, email, password } = req.body;

    // Check if the username or email already exists
    const existingGuide = await Guide.findOne({
      $or: [{ username }, { email }],
      isDeleted: false
    });

    if (existingGuide) {
      return res.status(400).json({
        success: false,
        message: "Guide with this username or email already exists."
      });
    }

    // Create a new guide
    const newGuide = new Guide({ username, guideName, email, password });
    await newGuide.save();

    logger.info(`[POST /api/guide] Created new guide: ${newGuide.username}`);
    res.status(201).json({
      success: true,
      data: newGuide
    });
  } catch (error) {
    logger.error(`[POST /api/guide] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Update a guide
// @route  PUT /api/guide/:id
exports.updateGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, guideName, email, password } = req.body;

    // Check if the guide exists and is not deleted
    const guide = await Guide.findOne({ _id: id, isDeleted: false });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found or already deleted."
      });
    }

    // Update guide fields
    guide.username = username || guide.username;
    guide.guideName = guideName || guide.guideName;
    guide.email = email || guide.email;
    guide.password = password || guide.password;

    await guide.save();

    logger.info(`[PUT /api/guide/${id}] Guide updated: ${guide.username}`);
    res.status(200).json({
      success: true,
      data: guide
    });
  } catch (error) {
    logger.error(`[PUT /api/guide/${req.params.id}] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Soft delete a guide
// @route  DELETE /api/guide/:id
exports.deleteGuide = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the guide exists
    const guide = await Guide.findOne({ _id: id, isDeleted: false });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found or already deleted."
      });
    }

    // Mark the guide as deleted
    guide.isDeleted = true;
    guide.deletedAt = new Date();
    await guide.save();

    logger.info(`[DELETE /api/guide/${id}] Soft deleted guide: ${guide.username}`);
    res.status(200).json({
      success: true,
      message: "Guide record soft deleted successfully."
    });
  } catch (error) {
    logger.error(`[DELETE /api/guide/${req.params.id}] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Get all guides (excluding soft-deleted records)
// @route  GET /api/guide
exports.getAllGuides = async (req, res, next) => {
  try {
    const guides = await Guide.find({ isDeleted: false });
    res.status(200).json({
      success: true,
      data: guides
    });
  } catch (error) {
    logger.error(`[GET /api/guide] Error: ${error.message}`);
    next(error);
  }
};
