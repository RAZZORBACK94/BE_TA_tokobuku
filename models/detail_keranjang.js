"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail_keranjang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this didalam keranjang user
    }
  }
  detail_keranjang.init(
    {
      id_keranjang: DataTypes.INTEGER,
      id_buku: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "detail_keranjang",
    }
  );
  return detail_keranjang;
};
