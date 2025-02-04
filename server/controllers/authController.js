const Admin = require("../models/AdminModel");
const Guide = require("../models/GuideModel");
const Student = require("../models/StudentModel");
const generateToken = require("../utils/tokenUtils");  // Import from utils
const loginLimiter = require("../middleware/authMiddleware"); // Import rate limiter

// Mapping role to the corresponding model
const ROLE_MODEL_MAP = {
  admin: Admin,
  guide: Guide,
  student: Student
};

exports.login = [loginLimiter, async (req, res) => {
  try {
    const { role, username, password } = req.body;

    if (!role || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if role is valid
    const UserModel = ROLE_MODEL_MAP[role.toLowerCase()];
    if (!UserModel) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // Find user in corresponding model
    const user = await UserModel.findOne({ username })
      .select('+password') // In case password field is not selected by default
      .exec();

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate both access and refresh tokens
    const accessToken = generateToken(user);
    const refreshToken = generateToken(user, true);

    // Save login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful",
      role: user.role,
      user: {
        id: user._id,
        role: user.role,
        username: user.username,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
}];

// Refresh token endpoint
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: "Invalid token type" });
    }

    const UserModel = ROLE_MODEL_MAP[decoded.role];
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: "Token refreshed successfully" });

  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
