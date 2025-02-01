const jwt = require("jsonwebtoken");

const generateToken = (user, isRefreshToken = false) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      type: isRefreshToken ? 'refresh' : 'access'
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: isRefreshToken ? "7d" : "1d" 
    }
  );
};

module.exports = generateToken;
