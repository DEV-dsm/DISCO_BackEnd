module.exports = (sequelize, DataType) => {
  return sequelize.define("post", {
    postID: {
      primaryKey: true,
      autoIncrement: true,
      type: DataType.INTEGER(),
    },
    userID: {
      type: DataType.INTEGER(),
      allowNull: false,
      references: {
        model: "users",
        key: "userID",
      },
    },
    title: {
      allowNull: false,
      type: DataType.STRING(),
    },
    body: {
      allowNull: false,
      type: DataType.STRING(),
    },
  });
};
