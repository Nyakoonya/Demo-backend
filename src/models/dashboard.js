const parser = require('../utils/parser');
module.exports = (sequelize, Sequelize) => {
  const dashboard = sequelize.define("Dashboards", {
    title: Sequelize.STRING,
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    folderId: Sequelize.UUID,
    description: {
        type: Sequelize.STRING,
        defaultValue: ''
    },
    ownerId: Sequelize.UUID,
  });
  return dashboard;
};
