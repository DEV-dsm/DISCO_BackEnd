const user = require("./user");
const post = require("./post");

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
        model: post,
        key: "postID",
      },
    },
    userID: {
      type: DataType.INTEGER(),
      allowNull: false,
      references: {
        model: user,
        key: "userID",
      },
    },
    body: {
      type: DataType.STRING(100),
      allowNull: false,
    },
  });
};
