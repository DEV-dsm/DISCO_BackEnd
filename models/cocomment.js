module.exports = (sequelize, DataTypes) => {
  return sequelize.define("cocomment", {
    cocommentID: {
      primaryKey: true,
      type: DataTypes.INTEGER(),
      allowNull: false,
      autoIncrement: true,
    },
    postID: {
      primaryKey: true,
      type: DataTypes.INTEGER(),
      references: {
        model: "posts",
        key: "postID",
      },
    },
    commentID: {
      primaryKey: true,
      type: DataTypes.INTEGER(),
      references: {
        model: "comments",
        key: "commentID",
      },
    },
    userID: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      references: {
        model: "users",
        key: "userID",
      },
    },
    body: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });
};
