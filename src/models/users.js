module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("User", {
    username: Sequelize.STRING,
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    password: Sequelize.STRING,
  });
  return user;
};
