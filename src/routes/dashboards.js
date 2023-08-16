const express = require("express");
const router = express.Router();
const service = require("../service/dashboards");

// create
router.post("/create", service.createDashboard);
// read
router.get("/list", service.findAllDashboards);
// update
router.put("/", service.updateDashboard);
// delete
router.delete("/:id", service.deleteDashboard);

module.exports = router;
