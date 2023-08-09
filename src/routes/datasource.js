const express = require("express");
const router = express.Router();
const uploadService = require("../service/datasource/upload");
const uploadExcel = require("../middleware/uploadExcel");
// upload datasource
router.post(
  "/upload/excel",
  uploadExcel.single("file"),
  uploadService.uploadExcelDatasource
);

module.exports = router;
