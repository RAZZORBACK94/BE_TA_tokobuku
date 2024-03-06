"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bukus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      isbn: {
        type: Sequelize.STRING,
      },
      nama_buku: {
        type: Sequelize.STRING,
      },
      author_buku: {
        type: Sequelize.STRING,
      },
      penerbit_buku: {
        type: Sequelize.STRING,
      },
      kategori_buku: {
        type: Sequelize.STRING,
      },
      deskripsi_buku: {
        type: Sequelize.TEXT,
      },
      cover_buku: {
        type: Sequelize.TEXT,
      },
      stok_buku: {
        type: Sequelize.INTEGER,
      },
      harga_buku: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bukus");
  },
};
