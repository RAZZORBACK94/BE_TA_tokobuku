"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_user: {
        type: Sequelize.STRING,
      },
      jk_user: {
        type: Sequelize.ENUM("Laki", "Perempuan"),
      },
      alamat_user: {
        type: Sequelize.TEXT,
      },
      telepon_user: {
        type: Sequelize.STRING,
      },
      username_user: {
        type: Sequelize.STRING,
      },
      password_user: {
        type: Sequelize.STRING,
      },
      role_user: {
        type: Sequelize.ENUM("admin", "pengguna"),
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
    await queryInterface.dropTable("users");
  },
};
