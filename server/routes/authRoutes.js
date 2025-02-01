const express = require("express");
const { login, refreshToken } = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/refresh-token
router.post("/refresh-token", refreshToken);

module.exports = router;
