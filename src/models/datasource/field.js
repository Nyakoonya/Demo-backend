module.exports = (sequelize, Sequelize) => {
  const datasource = sequelize.define("Field", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    datasourceId: Sequelize.UUID,
    fieldName: Sequelize.STRING,
  });
  return datasource;
};
