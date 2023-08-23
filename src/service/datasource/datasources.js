const { CODE_ERROR, CODE_SUCCESS } = require("../../utils/constant");
const db = require("../../models");
const id = global.userId || "a861b242-1f51-11ee-a44a-70bb57828822";
const owner = global.username || "admin";
const Datasource = db.datasource;
const { dropTable } = require("../../utils/index");
const { sequelize } = require("../../models/index");

function findAllDatasource(req, res, next) {
  const { folderId } = req.query;
  Datasource.findAll({
    where: {
      folderId,
    },
  })
    .then((result) => {
      res.json({
        code: CODE_SUCCESS,
        msg: "Get all datasources successfully!",
        data: {
          list: result
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
}
// paging query data
function findDataosurceData(req, res, next) {
  const { id, page, row } = req.query;
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
    .then((tableName) => {
      sequelize.query(
        `SELECT * FROM ${tableName} limit ${(page - 1) * row}, ${row}`
      );
    })
    .then((result) => {
      console.log("result", result);
      res.json({
        code: CODE_SUCCESS,
        msg: "Get datasource data successfully!",
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
// only for db datasource
function findDatasourceConfiguration(req, res, next) {}
function updateDatasourceInfo(req, res, next) {
  const { id, title } = req.body;
  Datasource.update(
    {
      title,
    },
    {
      where: {
        id,
      },
    }
  )
    .then(() => {
      res.json({
        code: CODE_SUCCESS,
        msg: "Update datasource title successfully!",
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

function deleteDatasource(req, res, next) {
  const { id } = req.params;
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
      Datasource.destroy({
        where: {
          id,
        },
      });
      dropTable(result);
    })
    .then(() => {
      res.json({
        code: CODE_SUCCESS,
        msg: "Delete datasource successfully!",
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
  findAllDatasource,
  findDataosurceData,
  updateDatasourceInfo,
  deleteDatasource,
};
