const express = require('express');
const { downloadData } = require('../controllers/downloadController');
const router = express.Router();

router.get('/download/:model', downloadData); // Accepts startDate and endDate as query params

module.exports = router;
