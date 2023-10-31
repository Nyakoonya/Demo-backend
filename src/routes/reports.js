const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../service/reports");

// fetch data
router.get('/', service.fetchAllReportsUnderDash);
router.post("/data", service.fetchReportData);
router.post('/', service.saveReports);

module.exports = router;
