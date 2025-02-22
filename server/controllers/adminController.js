// controllers/adminController.js
const Admin = require("../models/AdminModel");
const logger = require("../utils/logger");
const { sendEmail } = require("../utils/mailer");
const crypto = require("crypto"); // For generating random passwords

// @desc   Create a new admin
// @route  POST /api/admin
exports.createAdmin = async (req, res, next) => {
  try {
    const { username, adminName, email } = req.body;

    // Check if the username or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
      isDeleted: false,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Another admin with this username or email already exists.",
      });
    }

    // Generate random password before creating student
    const plainPassword = crypto.randomBytes(8).toString("hex");

    // Create a new admin with a temporary password
    const newAdmin = new Admin({
      username,
      adminName,
      email,
      password: plainPassword,
    });
    await newAdmin.save();

    logger.info(`[POST /api/admin] Created new admin: ${newAdmin.username}`);

    // Prepare email content
    const emailSubject = "Your Admin Account Credentials";
    const emailContent = `
      Hello ${newAdmin.adminName},

      Your admin account has been created successfully. Below are your login credentials:

      Username: ${newAdmin.username}
      Password: ${plainPassword}

      Please change your password after logging in for the first time.

      Regards,
      Your Organization
    `;

    // Send email with credentials
    await sendEmail(newAdmin.email, emailSubject, emailContent);

    // Respond to the client
    res.status(201).json({
      success: true,
      data: {
        id: newAdmin._id,
        username: newAdmin.username,
        adminName: newAdmin.adminName,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    logger.error(`[POST /api/admin] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Update an admin
// @route  PUT /api/admin/:id
exports.updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, adminName, email, password } = req.body;

    // Check if the admin exists and is not deleted
    const admin = await Admin.findById(id);
    if (!admin || admin.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Admin not found or already deleted.",
      });
    }

    // Update admin fields
    admin.username = username || admin.username;
    admin.adminName = adminName || admin.adminName;
    admin.email = email || admin.email;
    admin.password = password || admin.password;

    await admin.save();

    logger.info(`[PUT /api/admin/${id}] Admin updated: ${admin.username}`);
    res.status(201).json({
      success: true,
      data: {
        id: newAdmin._id,
        username: newAdmin.username,
        adminName: newAdmin.adminName,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    logger.error(`[PUT /api/admin/${req.params.id}] Error: ${error.message}`);
    next(error);
  }
};

// @desc   Soft delete an admin
// @route  DELETE /api/admin/:id
exports.deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the admin exists
    const admin = await Admin.findOne({ _id: id, isDeleted: false });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found or already deleted.",
      });
    }

    // Mark the admin as deleted
    admin.isDeleted = true;
    admin.deletedAt = new Date();
    await admin.save();

    logger.info(
      `[DELETE /api/admin/${id}] Soft deleted admin: ${admin.username}`
    );
    res.status(200).json({
      success: true,
      message: "Admin record soft deleted successfully.",
    });
  } catch (error) {
    logger.error(
      `[DELETE /api/admin/${req.params.id}] Error: ${error.message}`
    );
    next(error);
  }
};

// @desc   Get all admins (excluding soft-deleted records)
// @route  GET /api/admin
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find({ isDeleted: false }).select("-password");
    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    logger.error(`[GET /api/admin] Error: ${error.message}`);
    next(error);
  }
};
