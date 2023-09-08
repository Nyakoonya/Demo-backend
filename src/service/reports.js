const { CODE_ERROR, CODE_SUCCESS } = require("../utils/constant");
const db = require("../models");
const id = global.userId || "a861b242-1f51-11ee-a44a-70bb57828822";
const sequelize = db.sequelize;
const Report = db.report;
const Datasource = db.datasource;

/* fetch all reports info by dash id */
function fetchAllReportsUnderDash(req, res) {
  const { dashId } = req.query;
  Report.findAll({
    where: {
      dashId: dashId,
    },
  })
    .then((result) => {
      console.log("result---- fetch all reports", result);
      res.json({
        code: CODE_SUCCESS,
        msg: "Get all reports successfully!",
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        code: CODE_ERROR,
        msg: error.message,
        data: null,
      });
    });
}

/* fetch report data by datasetting */
function fetchReportData(req, res, next) {
  const {
    dataSetting: { dimensions, measures },
    limit,
  } = req.body;
  if (limit > 20000) limit = 20000;
  const attributes = [];
  let id = null;
  const measureFirstIndex = dimensions.length;
  [...dimensions, ...measures].forEach((item) => {
    if (id == null) {
      id = item.datasourceId;
    } else if (id !== item.datasourceId) {
      res.json({
        code: CODE_ERROR,
        msg: "Please select the same datasource field!",
        data: null,
      });
      return;
    }
    attributes.push(item.fieldName);
  });
  let fieldsSqlString = "";
  attributes.forEach((a, i) => {
    if (i === attributes.length - 1) {
      fieldsSqlString += `\`${a}\``;
    } else {
      fieldsSqlString += `\`${a}\`` + ",";
    }
  });
  console.log("attributes", attributes);
  console.log("fieldsSqlString", fieldsSqlString);
  console.log("id", id);
  Datasource.findAll({
    where: {
      id,
    },
  }).then((result) => {
    console.log("result", result);
    if (result.length > 0) {
      const { tableName } = result[0].dataValues;
      sequelize
        .query(`SELECT \`${fieldsSqlString}\` FROM \`${tableName}\` LIMIT ${limit}`)
        .then((data) => {
          console.log("data", data);
          //[{a: xx,b:xx}, {a:xx,b:xx}]->{dimensions:[{datasourceId:..,fieldName:.., index:0}],measures:[], data:[[xx,xx], [xx, xx]]}
          const newDimensions = dimensions.map((dim, i) => ({
            ...dim,
            index: i,
          }));
          const newMeasures = measures.map((mea, i) => ({
            ...mea,
            index: measureFirstIndex + i,
          }));
          const newData = data[0].map((d) => attributes.map((a) => d[a]));
          console.log("newData", newData);
          res.json({
            code: CODE_SUCCESS,
            msg: "Fetch data successfully!",
            data: {
              dimensions: newDimensions,
              measures: newMeasures,
              data: newData,
            },
          });
        })
        .catch((error) => {
          res.json({
            code: CODE_ERROR,
            msg: error.message,
            data: null,
          });
        });
    } else {
      res.json({
        code: CODE_ERROR,
        msg: "Cannot not find the data source",
        data: null,
      });
    }
  });
}
function saveReports(req, res, next) {
  const { reports, dashId } = req.body;
  //   const dataSettings = reports.map(r => r.dataSetting);
  //   Datasetting.bulkCreate()

  Report.destroy({
    where: {
      dashId,
    },
  })
    .then(() => {
      Report.bulkCreate(reports);
    })
    .then(() => {
      res.json({
        code: CODE_SUCCESS,
        msg: "Save successfully!",
        data: null,
      });
    })
    .catch((error) => {
      res.json({
        code: CODE_ERROR,
        msg: error.message,
        data: null,
      });
    });
}

module.exports = {
  fetchAllReportsUnderDash,
  fetchReportData,
  saveReports,
};
