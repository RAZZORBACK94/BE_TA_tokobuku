const buku = require("../models/buku");
const { request, response } = require("../routes/buku.route");

const transaksiModel = require(`../models/index`).transaksi;
const userModel = require("../models/index").user;
const detailOfTransaksiModel = require(`../models/index`).detail_transaksi;

const Op = require(`sequelize`).Op;

exports.addTransaksi = async (request, response) => {
  let newData = {
    id_user: request.body.id_user,
    id_buku: request.body.id_buku,
    id_admin: request.body.id_admin,
    qty_buku: request.body.qty_buku,
  };

  const total_transaksi = id_buku.harga * qty_buku;
  if (id_user.saldo && total_transaksi) {
    //
    let dataBaru = id_user.saldo - total_transaksi;

    userModel.update(dataBaru, { where: { id: id } }).then((result) => {
      /** if update's process success */
      return response.json({
        success: true,

        message: `Data user has been updated`,
      });
    });
  }

  transaksiModel.create(newData).then((result) => {
    return response
      .json({
        success: true,
        data: result,
        message: "transaksi berhasil",
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.updateTransaksi = async (request, response) => {
  let data = {
    id_user: request.body.id_user,
    id_buku: request.body.id_buku,
    id_admin: request.body.id_admin,
    total_transaksi: request.body.total_transaksi,
  };
  transaksiModel
    .update(data, { where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: "data transaksi update",
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.deleteTransaksi = (request, response) => {
  let id = request.params.id;

  transaksiModel
    .destroy({ where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: "transaksi  dihapus",
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
