module.exports = (sequelize, DataTypes) => {
  return sequelize.define("like", {
    postID: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      references: {
        model: "posts",
        key: "postID",
      },
    },
    userID: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      references: {
        model: "users",
        key: "userID",
      },
    },
  });
};
