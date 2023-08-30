module.exports = (sequelize, Sequelize) => {
  const report = sequelize.define("Report", {
    title: Sequelize.STRING,
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    dashId: Sequelize.UUID,
    category: Sequelize.STRING,
    type: Sequelize.STRING,
    content: Sequelize.JSON,
    dataSetting: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    limit: Sequelize.INTEGER
  });
  return report;
};
