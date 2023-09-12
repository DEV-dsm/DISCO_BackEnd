module.exports = (sequelize, DataType) => {
  return sequelize.define("comment", {
    commentID: {
      primaryKey: true,
      type: DataType.INTEGER(),
      autoIncrement: true,
    },
    postID: {
      type: DataType.INTEGER(),
      allowNull: false,
      references: {
        model: "posts",
        key: "postID",
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
    body: {
      type: DataType.STRING(100),
      allowNull: false,
    },
  });
};