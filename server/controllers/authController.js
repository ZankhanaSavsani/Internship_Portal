const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const generateToken = require("../utils/tokenUtils");
const { redactSensitiveData } = require("../utils/security");
const TokenBlacklist = require("../models/TokenBlacklist");
const Admin = require("../models/AdminModel");
const Guide = require("../models/GuideModel");
const Student = require("../models/StudentModel");
const { loginLimiter, refreshLimiter } = require("../middleware/authMiddleware");

const ROLE_MODEL_MAP = {
  admin: Admin,
  guide: Guide,
  student: Student,
};

/**
 * Helper function to generate secure cookie options
 * @param {number} maxAge - Cookie max age in milliseconds
 * @returns {Object} Cookie configuration object
 */
const createCookieOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === "production";
  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
  const domain = isProduction ? new URL(backendUrl).hostname : undefined;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge,
    domain,
    path: "/",
    partitioned: true,
  };
};

/**
 * Helper function to check if a token is blacklisted
 * @param {string} token - JWT token
 * @returns {Promise<boolean>} True if token is blacklisted
 */
const isTokenBlacklisted = async (token) => {
  const blacklistedToken = await TokenBlacklist.findOne({ token });
  return !!blacklistedToken;
};

/**
 * Helper function to set authentication cookies
 * @param {Response} res - Express response object
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
  const ACCESS_TOKEN_AGE = 15 * 60 * 1000; // 15 minutes
  const REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  const cookieOptions = createCookieOptions(ACCESS_TOKEN_AGE);
  const refreshCookieOptions = createCookieOptions(REFRESH_TOKEN_AGE);

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  if (process.env.NODE_ENV !== "production") {
    logger.debug("[COOKIES SET]", {
      accessTokenExpiry: new Date(Date.now() + ACCESS_TOKEN_AGE),
      refreshTokenExpiry: new Date(Date.now() + REFRESH_TOKEN_AGE),
      cookieConfig: redactSensitiveData({ ...cookieOptions }, ["domain"]),
    });
  }
};

/**
 * Helper function to set role-specific cookies
 * @param {Response} res - Express response object
 * @param {Object} user - User object
 * @param {string} role - User role
 */
const setRoleSpecificCookies = (res, user, role) => {
  const roleHandlers = {
    student: (user, options) => {
      res.cookie("userId", user._id.toString(), options);
      if (user.studentName) {
        res.cookie("studentName", user.studentName, options);
      }
      res.cookie("role", user.role, options);
    },
    admin: (user, options) => {
      res.cookie("userId", user._id.toString(), options);
      res.cookie("role", user.role, options);
    },
    guide: (user, options) => {
      res.cookie("userId", user._id.toString(), options);
      res.cookie("role", user.role, options);
    },
  };

  const handler = roleHandlers[role.toLowerCase()];
  if (handler) {
    handler(user, createCookieOptions(24 * 60 * 60 * 1000));
  }
};

/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = [
  loginLimiter,
  async (req, res) => {
    try {
      const { role, username, password, studentId, semester } = req.body;

      // Input validation
      if (!role || !password || (!username && !studentId) || (role === "student" && !semester)) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const UserModel = ROLE_MODEL_MAP[role.toLowerCase()];
      if (!UserModel) {
        return res.status(400).json({
          success: false,
          message: "Invalid role selected",
        });
      }

      const loginIdentifier = role.toLowerCase() === "student" 
        ? { studentId, semester } 
        : { username };

      const user = await UserModel.findOne(loginIdentifier)
        .select("+password")
        .exec();

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Token generation
      const accessToken = generateToken(user);
      const refreshToken = generateToken(user, true);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Set cookies
      setAuthCookies(res, accessToken, refreshToken);
      setRoleSpecificCookies(res, user, role);

      // Prepare response
      const userResponse = {
        id: user._id,
        role: user.role,
        [role.toLowerCase() === "student" ? "studentId" : "username"]:
          role.toLowerCase() === "student" ? user.studentId : user.username,
      };

      if (role.toLowerCase() === "student") {
        userResponse.semester = user.semester;
        userResponse.studentName = user.studentName;
        userResponse.isOnboarded = user.isOnboarded;
      }

      logger.info("[LOGIN SUCCESS]", { userId: user._id, role });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: userResponse,
      });
    } catch (error) {
      logger.error("[LOGIN ERROR]", { error: error.message });
      return res.status(500).json({
        success: false,
        message: "An error occurred during login",
      });
    }
  },
];

/**
 * @desc    Refresh Access Token
 * @route   POST /api/auth/refresh-token
 * @access  Private
 */
exports.refreshToken = [
  refreshLimiter,
  async (req, res) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token is required",
        });
      }

      if (await isTokenBlacklisted(refreshToken)) {
        return res.status(401).json({
          success: false,
          message: "Token has been revoked",
        });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

      if (decoded.type !== "refresh") {
        return res.status(403).json({
          success: false,
          message: "Invalid token type",
        });
      }

      const UserModel = ROLE_MODEL_MAP[decoded.role];
      const user = await UserModel.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      const newAccessToken = generateToken(user);
      res.cookie(
        "accessToken",
        newAccessToken,
        createCookieOptions(15 * 60 * 1000)
      );

      return res.json({
        success: true,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  },
];

/**
 * @desc    Logout User
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const isProduction = process.env.NODE_ENV === "production";
    const domain = isProduction ? new URL(process.env.BACKEND_URL).hostname : undefined;

    // Clear all auth cookies
    const cookiesToClear = [
      "accessToken", "refreshToken", "userId", 
      "studentName", "role", "isAuthenticated"
    ];

    cookiesToClear.forEach(name => {
      res.cookie(name, "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        expires: new Date(0),
        domain
      });
    });

    // Blacklist refresh token if exists
    if (refreshToken) {
      await TokenBlacklist.create({
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during logout",
    });
  }
};

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role.toLowerCase();

    const UserModel = ROLE_MODEL_MAP[role];
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching user details",
    });
  }
};