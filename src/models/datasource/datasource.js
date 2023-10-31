module.exports = (sequelize, Sequelize) => {
  const datasource = sequelize.define("Datasource", {
    title: Sequelize.STRING,
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    folderId: Sequelize.INTEGER,
    type: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    tableName: Sequelize.STRING,
    ownerId: Sequelize.UUID,
  });
  return datasource;
};
