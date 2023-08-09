const { CODE_ERROR, CODE_SUCCESS } = require("../../utils/constant");
const db = require("../../models");

const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");

const uploadExcelDatasource = async (req, res) => {
  try {
    if (req.file == undefined) {
      res.json({
        code: CODE_ERROR,
        msg: "Please upload only excel file!",
        data: null,
      });
    }
    let path =
      __basedir + "/resources/static/assets/uploads/excel/" + req.file.filename;
    readXlsxFile(path)
      .then((rows) => {
        const header = rows[0];
        const excelModel = require("../../utils/excelHandler.js")(
          header,
          rows[1]
        );
        db.excel = require("../../models/datasource/ExcelModel.js")(
          db.sequelize,
          db.Sequelize,
          req.file.filename,
          excelModel
        );
        //  skip header
        rows.shift();

        let excelData = [];

        rows.forEach((row) => {
          let item = {};
          header.forEach((h, i) => {
            if (!item[h]) {
              item[h] = row[i];
            }
          });
          excelData.push(item);
        });

        const ExcelDB = db.excel;
        // 创建此表
        (async () => {
          await ExcelDB.sync({ force: false }); // force:true => delete it if exists
        })()
          .then(() => {
            // 批量插入更新数据
            console.log('excelData---->>>', excelData)
            ExcelDB.bulkCreate(excelData)
              .then(() => {
                res.json({
                  code: CODE_SUCCESS,
                  msg: "Upload the file successfully: " + req.file.originalname,
                  data: null,
                });
              })
              .catch((error) => {
                res.json({
                  code: CODE_ERROR,
                  msg: "Fail to import data into database!",
                  error: error.message,
                });
              });
          })
          .catch((error) => {
            console.log("error", error);
            res.json({
              code: CODE_ERROR,
              msg: error.message,
            });
          });
      })
      .catch((error) => {
        console.log("error", error);
        console.log("path", path);
      });
  } catch (error) {
    console.log("error", error);
    res.json({
      code: CODE_ERROR,
      msg: "Could not upload the file" + req.file.originalname,
      error: error.message,
    });
  }
};

module.exports = {
  uploadExcelDatasource,
};
