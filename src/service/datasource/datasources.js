const { CODE_ERROR, CODE_SUCCESS } = require("../../utils/constant");
const db = require("../../models");
const dbConfig = require("../../config/db.config");
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
        .query(`SELECT * FROM \`${tableName}\` LIMIT ${row} OFFSET ${page - 1}`)
        .then((result) => {
          console.log("result", result);
          if (result.length > 0) {
            sequelize
              .query(`SELECT COUNT(*) as total FROM \`${tableName}\` as total`)
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
  const { id, title, folderId } = req.body;
  Datasource.update(
    {
      title,
    },
    {
      where: {
        id,
        folderId,
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
  Datasource.findAll({
    where: {
      id,
    },
  })
    .then((result) => {
      if (result.length > 0) {
        const { tableName } = result[0].dataValues;
        Datasource.destroy({
          where: {
            id,
          },
        });
        dropTable(tableName);
      } else {
        res.json({
          code: CODE_ERROR,
          msg:'cannot find this datasource',
          data: null,
        });
      }
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

function queryColumnsUnderFolder(req, res) {
  const { folderId } = req.query;
  // console.log('folderId-------------->>>>>', folderId)
  const queryColumnsSql = `select ds.id as dataSourceId, ds.title , cl.COLUMN_NAME as columnName from
  \`${dbConfig.DB}\`.\`datasources\` ds
  inner join \`INFORMATION_SCHEMA\`.\`COLUMNS\` cl
  on ds.tableName = cl.TABLE_NAME
  and cl.\`TABLE_SCHEMA\`= '${dbConfig.DB}'
  where ds.folderId = '${folderId}'
  order by ds.id asc, cl.COLUMN_NAME asc`;
  sequelize
    .query(queryColumnsSql)
    .then((result) => {
      // console.log('result------->>>>>', result);
      res.json({
        code: CODE_SUCCESS,
        msg: "Get columns under folder successfully",
        data: result.length > 0 ? result[0] : [],
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
  queryColumnsUnderFolder,
};
