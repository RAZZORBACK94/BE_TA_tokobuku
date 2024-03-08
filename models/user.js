"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      nama_user: DataTypes.STRING,
      jk_user: DataTypes.ENUM("Laki", "Perempuan"),
      alamat_user: DataTypes.TEXT,
      telepon_user: DataTypes.STRING,
      saldo_user: DataTypes.INTEGER,
      username_user: DataTypes.STRING,
      password_user: DataTypes.STRING,
      role_user: DataTypes.ENUM("admin", "Pengguna"),
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
