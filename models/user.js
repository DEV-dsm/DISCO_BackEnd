module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    userID: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "상태메세지가 없습니다.",
    },
    token: {
      type: DataTypes.STRING(200),
    },
  });
};
