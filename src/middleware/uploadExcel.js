const multer = require("multer");

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/excel/");
  },
  filename: (req, file, cb) => {
    console.log("file.originalname", file.originalname);
    cb(null, `${Date.now()}${file.originalname}`);
  },
});
const uploadExcel = multer({
  storage,
  fileFilter: excelFilter,
});

module.exports = uploadExcel;
