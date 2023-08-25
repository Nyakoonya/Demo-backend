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
          list: result,
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
    .then((result) => {
      const {
        dataValues: { tableName },
      } = result && result[0];
      sequelize
        .query(`SELECT * FROM ${tableName} LIMIT ${row} OFFSET ${page - 1}`)
        .then((result) => {
          console.log("result", result);
          if (result.length > 0) {
            sequelize
              .query(`SELECT COUNT(*) as total FROM ${tableName} as total`)
              .then((response) => {
                console.log("response", response);
                const { total } = response[0][0];
                res.json({
                  code: CODE_SUCCESS,
                  msg: "Get datasource data successfully!",
                  data: {
                    data: result[0],
                    total,
                  },
                });
              });
          } else {
            res.json({
              code: CODE_ERROR,
              msg: "Get datasource data failed!",
              data: null,
            });
          }
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
