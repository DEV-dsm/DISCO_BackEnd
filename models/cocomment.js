const comment = require("./comment");
const user = require("./user");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("cocomment", {
    cocommentID: {
      primaryKey: true,
      type: DataTypes.INTEGER(),
      allowNull: false,
      autoIncrement: true,
    },
    commentID: {
      primaryKey: true,
      type: DataTypes.INTEGER(),
      references: {
        model: comment,
        key: "commentID",
      },
    },
    userID: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      references: {
        model: user,
        key: "userID",
      },
    },
    body: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });
};
