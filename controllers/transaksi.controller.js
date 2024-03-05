const { request } = require("../routes/buku.route")

const transaksiModel = require(`../models/index`).transaksi
const detailOfTransaksiModel = require(`../models/index`).detail_transaksi

const Op = require(`sequelize`).Op

exports.addTransaksi = async (request, response) => {
    let newData = {
        id_user: request.body.id_user,
        total_transaksi: request.body.total_transaksi,
        id_admin: request.body.id_admin
    }
}