module.exports = (sequelize, DataType) => {
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
      allowNull: false,
      references: {
        model: "users",
        key: "userID",
      },
    },
  });
};
