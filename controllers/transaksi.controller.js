const { Transaction } = require("sequelize");
const buku = require("../models/buku");
const keranjang = require(`../models/index`).keranjang;
const detailkeranjang = require(`../models/index`).detail_keranjang;
const midtransCli = require("midtrans-client");
const { response } = require("express");

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
    const id_keranjang = akhir.id;

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
  await this.hitungAkhir(response, request.user.id);
  return response.json({
    success: true,
    message: " keranjang baru dan buku telah masuk di keranjang",
  });
};

exports.hitungAkhir = async (response, id) => {
  const userKeranjang = await keranjang.findOne({
    where: { status: "didraft", id: id },
  });

  const id_keranjang = userKeranjang.id;
  if (!id_keranjang) {
    return response.json({
      success: false,
      data: cartData,
      message: "keranjang not found, go shop",
    });
  }

  totalharga = await detailkeranjang.sum("total", {
    where: { id_keranjang: id_keranjang },
  });

  await detailkeranjang.update({ totalharga: totalharga }, { where: { id: id_keranjang } });
};

exports.removeproduct = async (request, response) => {
  const id = request.params.id;
  try {
    const userCart = await keranjang.findOne({
      where: { status: "draft", id_user: request.user.id },
    });

    const isDeleted = await detailkeranjang.destroy({
      where: { id_buku: id, id_keranjang: userCart.id },
    });

    if (!isDeleted) {
      return response.json({
        success: false,
        message: "No Product Found",
      });
    }
    await this.hitungAkhir(response, request.user.id);
    return response.json({
      success: true,
      message: "Product Has Been Deleted from Cart",
    });
  } catch (error) {
    console.error("Error deleting product", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.checkout = async (request, response) => {
  const iduser = request.userData.id_user;

  const keranjangUser = await keranjang.findOne({
    where: { id_user: iduser, status: "didraft" },
  });

  if (!keranjangUser) {
    return response.json({
      success: false,
      message: "cart not found",
    });
  }

  await keranjang.update({ status: "dibayar" }, { where: { id_user: iduser, status: "draft" } });

  await detailkeranjang.update(
    { check: "true" },
    {
      where: { id_keranjang: keranjangUser.id },
    }
  );

  return response.json({
    success: true,
    data: keranjangUser.id,
    message: "checkout berhasil",
  });
};
