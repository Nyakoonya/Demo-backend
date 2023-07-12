const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const service = require("../service/folders");

// create
router.post('/create', service.createFolder);
// read
router.get('/list', service.readFoldersByUser)
// update
router.put('/', service.updateFolderInfo)
// delete
router.delete('/:id', service.deleteFolderById)

module.exports = router