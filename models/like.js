module.export = (sequelize, DataType) => {
  return sequelize.define("like", {
    postID: {
      primaryKey: true,
      references: {
        model: "users",
        key: "userID",
      },
    },
    userID: {
      allowNull: false,
      references: {
        model: "users",
        key: "userID",
      },
    },
  });
};
