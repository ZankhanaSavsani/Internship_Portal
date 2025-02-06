// models/TokenBlacklist.js

const mongoose = require('mongoose');

const TokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// Index to ensure efficient querying by token
TokenBlacklistSchema.index({ token: 1 }, { unique: true });

const TokenBlacklist = mongoose.model('TokenBlacklist', TokenBlacklistSchema);

module.exports = TokenBlacklist;
