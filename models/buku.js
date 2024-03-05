'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class buku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  buku.init({
    isbn: DataTypes.STRING,
    nama_buku: DataTypes.STRING,
    author_buku: DataTypes.STRING,
    penerbit_buku: DataTypes.STRING,
    kategori_buku: DataTypes.STRING,
    deskripsi_buku: DataTypes.TEXT,
    cover_buku: DataTypes.TEXT,
    stok_buku: DataTypes.INTEGER,
    harga_buku: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'buku',
  });
  return buku;
};