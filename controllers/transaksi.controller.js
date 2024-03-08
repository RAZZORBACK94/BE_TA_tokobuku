const buku = require("../models/buku");
const keranjang = require(`../models/index`).keranjang;
const detailkeranjang = require(`../models/index`).detail_keranjang;

const Op = require(`sequelize`).Op;

exports.addtoKeranjang = async (request, response) => {
  let keranjangData = {
    id_user: request.user.id_user,
    status: "didraft",
  };
  const cekKeranjang = await keranjang.findOne({
    where: { id_user: keranjangData.id_user, status: "didraft" },
  });
  const bukuData = await buku.findOne({
    where: { id: request.body.id_buku },
  });

  if (!cekKeranjang) {
    const id_keranjang = cekKeranjang.id;

    const cekKeranjangItem = await detailkeranjang.findOne({ where: { id_keranjang: id_keranjang, id_buku: request.body.id_buku } });

    if (cekKeranjangItem) {
      const hargaAkhir = request.body.qty * bukuData.harga_buku;

      await detailkeranjang.update(
        {
          qty: request.body.qty,
          total: hargaAkhir,
        },
        {
          where: {
            id_keranjang: id_keranjang,
            id_buku: request.body.id_buku,
          },
        }
      );
    } else {
      const detailBeli = {
        id_buku: request.body.id_buku,
        qty: request.body.qty,
        total: request.body.qty * bukuData.harga,
        id_keranjang: id_keranjang,
      };
      await detailkeranjang.create(detailBeli);
    }
  } else {
    const akhir = await keranjang.create(keranjangData);
    const id_keranjang = result.id;

    const bukuData = await buku.findOne({
      where: {
        id: request.body.id_buku,
      },
    });
    const detailBeli = {
      id_buku: request.body.id_buku,
      qty: request.body.qty,
      total: request.body.qty * bukuData.harga,
      id_keranjang: id_keranjang,
    };
    await detailkeranjang.create(detailBeli);
  }
  await exports.hitungAkhir(response, request.user.id);
  return response.json({
    success: true,
    message: " keranjang baru dan buku telah masuk di keranjang",
  });
};

exports.updateTransaksi = async (request, response) => {};

exports.deleteTransaksi = (request, response) => {};
