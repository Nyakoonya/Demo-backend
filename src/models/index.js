const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    ...dbConfig.pool,
  },
  operatorAliases: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.excel = require("./datasource/ExcelModel.js")(sequelize, Sequelize, excelHandler);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("connection successful");
  } catch (error) {
    console.error("connection failed", error);
  }
})();

module.exports = db;
