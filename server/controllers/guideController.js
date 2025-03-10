// controllers/guideController.js
const Guide = require("../models/GuideModel");
const logger = require("../utils/logger");
const { sendEmail } = require("../utils/mailer");
const crypto = require("crypto"); // For generating random passwords

// @desc   Create a new guide
// @route  POST /api/guide
exports.createGuide = async (req, res, next) => {
  try {
    const { username, guideName, email } = req.body;

    // Check if the username or email already exists
    const existingGuide = await Guide.findOne({
      $or: [{ username }, { email }],
      isDeleted: false,
    });

    if (existingGuide) {
      return res.status(400).json({
        success: false,
        message: "A guide with this username or email already exists.",
      });
    }

    // Generate random password before creating guide
    const plainPassword = crypto.randomBytes(8).toString("hex");

    // Create a new guide with a temporary password
    const newGuide = new Guide({
      username,
      guideName,
      email,
      password: plainPassword, // This will be hashed in the pre-save hook
    });
    await newGuide.save();

    logger.info(`[POST /api/guide] Created new guide: ${newGuide.username}`);

    // Prepare email content with HTML formatting
    const emailSubject = "🎉 Welcome to Guide Portal - Your Login Credentials";
    const emailContent = `
      <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Guide Portal</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.8;
      color: #333333;
      max-width: 650px;
      margin: 0 auto;
      background-color: #f8f9fa;
      padding: 20px;
    }
    .email-container {
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
      background-color: #ffffff;
    }
    .email-header {
      background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
      color: white;
      padding: 25px 15px;
      text-align: center;
      position: relative;
    }
    .email-header h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .header-accent {
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 10px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E");
      background-size: cover;
    }
    .logo {
      margin-bottom: 15px;
      height: 60px;
      width: auto;
    }
    .email-body {
      padding: 35px 30px;
      background-color: #ffffff;
      text-align: center;
    }
    .welcome-emoji {
      font-size: 48px;
      margin-bottom: 20px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .email-body h2 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #2d3748;
      font-size: 24px;
    }
    .email-body p {
      margin-bottom: 20px;
      font-size: 16px;
      color: #4a5568;
    }
    .credentials-box {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
      text-align: left;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .credential-item {
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
    .credential-item:last-child {
      margin-bottom: 0;
    }
    .credential-label {
      font-weight: 600;
      display: flex;
      align-items: center;
      width: 120px;
      font-size: 15px;
      color: #4b5563;
    }
    .credential-value {
      font-family: 'Courier New', monospace;
      background-color: #f3f4f6;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      letter-spacing: 0.5px;
      font-size: 16px;
      font-weight: 500;
      color: #1f2937;
      flex: 1;
      min-width: 180px;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .important-note {
      background-color: #fffbeb;
      border-left: 5px solid #f59e0b;
      padding: 20px;
      margin: 30px 0;
      text-align: left;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(245, 158, 11, 0.1);
    }
    .important-note p {
      margin: 0;
      color: #92400e;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 25px 20px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .button {
      display: inline-block;
      color: #f7f7f7;
      background: rgb(247, 247, 247);
      border: 2px solid black;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 10px;
      margin-top: 25px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 6px rgba(216, 219, 223, 0.84);
      transition: all 0.3s ease;
      letter-spacing: 0.3px;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(255, 255, 255, 0.35);
    }
    .support-section {
      margin-top: 40px;
      padding-top: 25px;
      border-top: 1px dashed #e5e7eb;
      font-size: 15px;
      color: #4b5563;
    }
    .support-section h3 {
      color: #1f2937;
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 18px;
    }
    .support-section p {
      margin: 8px 0;
    }
    .contact-card {
      display: inline-block;
      background-color: #f3f4f6;
      border-radius: 8px;
      padding: 12px 20px;
      margin: 8px 0;
      text-align: left;
      border-left: 3px solid #3b82f6;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    .contact-name {
      font-weight: 600;
      color: #1f2937;
    }
    .contact-info {
      color: #4b5563;
    }
    .emoji {
      font-size: 20px;
      vertical-align: middle;
      margin-right: 8px;
      display: inline-block;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 10px;
      }
      .email-body {
        padding: 25px 20px;
      }
      .credentials-box {
        padding: 20px 15px;
      }
      .credential-label {
        width: 100%;
        margin-bottom: 8px;
      }
      .credential-value {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Welcome to Guide Portal</h1>
      <div class="header-accent"></div>
    </div>
    <div class="email-body">
      <div class="welcome-emoji">
        🎉✨
      </div>
      <h2>Hi ${newGuide.guideName}!</h2>
      <p>Your guide account has been created successfully. Below are your login credentials:</p>
      
      <div class="credentials-box">
        <div class="credential-item">
          <span class="credential-label"><span class="emoji">👤</span> Username:</span>
          <span class="credential-value">${newGuide.username}</span>
        </div>
        <div class="credential-item">
          <span class="credential-label"><span class="emoji">🔑</span> Password:</span>
          <span class="credential-value">${plainPassword}</span>
        </div>
      </div>
      
      <div class="important-note">
        <p><span class="emoji">⚠️</span> <strong>Important:</strong> Please change your password after logging in for the first time for security purposes. This temporary password will expire in 72 hours.</p>
      </div>
      
      <a href="http://localhost:3000/login" class="button">Login to Your Account</a>
      
      <div class="support-section">
        <h3><span class="emoji">📞</span> Need Help?</h3>
        
        <div class="contact-card">
          <div class="contact-name">Brinda Patel</div>
          <div class="contact-info">Phone: 74052 81125</div>
          <div class="contact-info">Email: brindapatel.cse@charusat.ac.in</div>
        </div>
        
        <div class="contact-card">
          <div class="contact-name">Abhishek Patel</div>
          <div class="contact-info">Phone: 90990 56918</div>
          <div class="contact-info">Email: abhishekpatel.cse@charusat.ac.in</div>
        </div>
      </div>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} Charotar University of Science & Technology (CHARUSAT). All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send HTML email with credentials
    await sendEmail(newGuide.email, emailSubject, emailContent, true);

    // Respond to the client
    res.status(201).json({
      success: true,
      data: {
        id: newGuide._id,
        username: newGuide.username,
        guideName: newGuide.guideName,
        email: newGuide.email,
      },
    });
  } catch (error) {
    logger.error(`[POST /api/guide] Error: ${error.message}`);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A guide with the same username or email already exists.",
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the guide.",
    });
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
        message: "Guide not found or already deleted.",
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
      data: guide,
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
        message: "Guide not found or already deleted.",
      });
    }

    // Mark the guide as deleted
    guide.isDeleted = true;
    guide.deletedAt = new Date();
    await guide.save();

    logger.info(
      `[DELETE /api/guide/${id}] Soft deleted guide: ${guide.username}`
    );
    res.status(200).json({
      success: true,
      message: "Guide record soft deleted successfully.",
    });
  } catch (error) {
    logger.error(
      `[DELETE /api/guide/${req.params.id}] Error: ${error.message}`
    );
    next(error);
  }
};

// @desc   Get a single guide by ID (excluding soft-deleted records)
// @route  GET /api/guide/:id
exports.getGuideById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the guide and exclude soft-deleted records
    const guide = await Guide.findOne({ _id: id, isDeleted: false });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found or already deleted.",
      });
    }

    res.status(200).json({
      success: true,
      data: guide,
    });
  } catch (error) {
    logger.error(`[GET /api/guide/${req.params.id}] Error: ${error.message}`);
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
      data: guides,
    });
  } catch (error) {
    logger.error(`[GET /api/guide] Error: ${error.message}`);
    next(error);
  }
};
