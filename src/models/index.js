const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    ...dbConfig.pool,
  },
  operatorAliases: false,
  define: {
    timestamps: false,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.excel = require("./datasource/ExcelModel.js")(sequelize, Sequelize, excelHandler);
db.folder = require("./folder.js")(sequelize, Sequelize);
db.dashboard = require("./dashboard.js")(sequelize, Sequelize);
db.datasource = require("./datasource/datasource.js")(sequelize, Sequelize);
db.report = require("./reports.js")(sequelize, Sequelize);
db.field = require("./datasource/field")(sequelize, Sequelize);
(async () => {
  try {
    await sequelize.authenticate();
    console.log("connection successful");
  } catch (error) {
    console.error("connection failed", error);
  }
})();

module.exports = db;
