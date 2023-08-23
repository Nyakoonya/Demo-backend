module.exports = (sequelize, Sequelize) => {
  const folder = sequelize.define("Folder", {
    title: Sequelize.STRING,
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    ownerId: Sequelize.UUID,
    description: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    owner: Sequelize.STRING,
    img: Sequelize.STRING
  });
  return folder;
};
