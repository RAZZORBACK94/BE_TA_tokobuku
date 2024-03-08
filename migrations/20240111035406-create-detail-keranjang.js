"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_keranjangs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_keranjang: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "keranjangs",
          key: "id",
        },
      },
      id_buku: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "bukus",
          key: "id",
        },
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      total: {
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
    await queryInterface.dropTable("detail_keranjangs");
  },
};
