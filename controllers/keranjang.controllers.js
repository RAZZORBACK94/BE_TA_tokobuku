const keranjang = require("../models/index").keranjang;
const detailkeranjang = require("../models/index").detail_keranjang;
const Op = require("sequelize").Op;

exports.getKeranjang = async (request, response) => {
  const userKeranjang = await keranjang.findOne({
    where: { status: "pending" },
  });

  if (!userKeranjang) {
    return response.json({
      succes: false,
      message: "kamu belum menambahkan apapun",
    });
  }
  const detailkeranjangUser = await detailkeranjang.findAll({
    where: { id_keranjang: userKeranjang.id },
  });

  return response.json({
    succes: true,
    keranjang: userKeranjang,
    data: detailkeranjangUser,
    message: "keranjang sudah teredia",
  });
};
