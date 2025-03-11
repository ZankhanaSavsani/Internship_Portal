const express = require("express");
const router = express.Router();
const guideAllocationController = require("../controllers/guideAllocationController");

// Allocate guide to a range of students
router.post("/allocate", guideAllocationController.allocateGuideToRange);

// Fetch all guide allocations
router.get("/allocations", guideAllocationController.getAllGuideAllocations);

module.exports = router;