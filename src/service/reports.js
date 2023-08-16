const { CODE_ERROR, CODE_SUCCESS } = require("../utils/constant");
const db = require("../models");
const id = global.userId || "a861b242-1f51-11ee-a44a-70bb57828822";
const sequelize = db.sequelize;
const Report = db.report;
const Datasource = db.datasource;
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
      fieldsSqlString += a;
    } else {
      fieldsSqlString += a + ",";
    }
  });
  console.log("attributes", attributes);
  Datasource.findAll(
    {
      attributes: ["tableName"],
    },
    {
      where: {
        id,
      },
    }
  )
    .then((result) => {
      console.log("result", result);
      sequelize.query(`SELECT TOP ${limit} ${fieldsSqlString} FROM ${result}`);
    })
    .then((data) => {
      console.log("data", data);
      //[{a: xx,b:xx}, {a:xx,b:xx}]->{dimensions:[{datasourceId:..,fieldName:.., index:0}],measures:[], data:[[xx,xx], [xx, xx]]}
      const newDimensions = dimensions.map((dim, i) => ({ ...dim, index: i }));
      const newMeasures = measures.map((mea, i) => ({
        ...mea,
        index: measureFirstIndex + i,
      }));
      const newData = data.map((d) => attributes.map((a) => d[a]));
      console.log("newData", newData);
      res.json({
        code: CODE_SUCCESS,
        msg: "Fetch data successfully!",
        data: {
          dimensions: newDimensions,
          measures: newMeasures,
          data,
        },
      });
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
  fetchReportData,
  saveReports,
};
