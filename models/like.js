module.exports = (sequelize, DataTypes) => {
  return sequelize.define("like", {
    postID: {
      type: DataType.INTEGER(),
      primaryKey: true,
      references: {
        model: "users",
        key: "userID",
      },
    },
    userID: {
      type: DataType.INTEGER(),
      primaryKey: true,
      references: {
        model: "users",
        key: "userID",
      },
    },
  });
};
