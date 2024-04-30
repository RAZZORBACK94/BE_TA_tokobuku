"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class keranjang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this keranjang user
    }
  }
  keranjang.init(
    {
      id_user: DataTypes.INTEGER,
      total_transaksi: DataTypes.INTEGER,
      status: DataTypes.ENUM("pending", "paid", "cancel"),
      order_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "keranjang",
    }
  );
  return keranjang;
};
