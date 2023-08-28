const express = require("express");
const router = express.Router();
const datasourceService = require("../service/datasource/datasources");
const uploadService = require("../service/datasource/upload");
const uploadExcel = require("../middleware/uploadExcel");
// upload datasource
router.post(
  "/upload/excel",
  uploadExcel.single("file"),
  uploadService.uploadExcelDatasource
);

router.put("/", datasourceService.updateDatasourceInfo);
router.get("/list", datasourceService.findAllDatasource);
router.get("/data", datasourceService.findDataosurceData);
router.delete("/:id", datasourceService.deleteDatasource);
router.get('/columnsUnderFolder', datasourceService.queryColumnsUnderFolder);
module.exports = router;
