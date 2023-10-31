const parser = require("../utils/parser");
module.exports = (sequelize, Sequelize) => {
  const dashboard = sequelize.define("Dashboards", {
    title: Sequelize.STRING,
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    folderId: Sequelize.INTEGER,
    description: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    ownerId: Sequelize.UUID,
  });
  return dashboard;
};
