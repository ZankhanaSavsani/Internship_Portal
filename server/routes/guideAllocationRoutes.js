const express = require("express");
const router = express.Router();
const {
  allocateGuideToRange,
  getAllGuideAllocations,
} = require("../controllers/guideAllocationController");
const {validateToken, checkRoleAccess } = require("../middleware/authMiddleware");

// Allocate guide to a range of students
router.post("/allocate", validateToken, checkRoleAccess(["admin"]), allocateGuideToRange);

// Fetch all guide allocations
router.get("/allocations", validateToken, checkRoleAccess(["admin"]), getAllGuideAllocations);

module.exports = router;
