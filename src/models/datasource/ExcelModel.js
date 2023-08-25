module.exports = (sequelize, Sequelize, fileName, excelModel) => {
  console.log("excelModel", excelModel);
  const attributes = {};
  const tableName = fileName.split(".")[0];
  Object.keys(excelModel).forEach((key) => {
    attributes[key] = {
      ...excelModel[key],
      type: Sequelize[excelModel[key].type],
    };
  });
  const Excel = sequelize.define(
    tableName,
    {
      // title: {
      //   type: Sequelize.STRING,
      // },
      // description: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      // },
      // published: {
      //   type: Sequelize.BOOLEAN,
      // },
      ...attributes,
    },
    {
      freezeTableName: true,
    }
  );
  return Excel;
};
