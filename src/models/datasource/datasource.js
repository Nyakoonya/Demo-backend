module.exports = (sequelize, Sequelize) => {
  const datasource = sequelize.define("Datasource", {
    title: Sequelize.STRING,
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    folderId: Sequelize.UUID,
    type: Sequelize.STRING,
    tableName: Sequelize.STRING,
    ownerId: Sequelize.UUID,
  });
  return datasource;
};
