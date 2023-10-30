const parser = require('../utils/parser');
module.exports = (sequelize, Sequelize) => {
  const mainpageSettings = sequelize.define("Mainpage_settings", {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
    item_value: Sequelize.STRING,
  });
  return mainpageSettings;
};
