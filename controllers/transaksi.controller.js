const { Transaction, where } = require("sequelize");
const user = require("../models/index").user;
const buku = require("../models/index").buku;
const keranjang = require(`../models/index`).keranjang;
const detailkeranjang = require(`../models/index`).detail_keranjang;
const midCli = require("midtrans-client");

const Op = require(`sequelize`).Op;

exports.addtoKeranjang = async (request, response) => {
  let keranjangData = {
    id_user: request.user.id,
    status: "pending",
  };
  console.log(keranjangData.id);
  const cekKeranjang = await keranjang.findOne({
    where: { id_user: keranjangData.id_user, status: "pending" },
  });
  console.log(cekKeranjang);
  const bukuData = await buku.findOne({
    where: { id: request.body.id_buku },
  });

  if (!cekKeranjang) {
    const akhir = await keranjang.create(keranjangData);
    const id_keranjang = akhir.id;

    const bukuData = await buku.findOne({
      where: {
        id: request.body.id_buku,
      },
    });

    const detailBeli = {
      id_keranjang: id_keranjang,
      id_buku: request.body.id_buku,
      qty: request.body.qty,
      hargaAkhir: request.body.qty * bukuData.harga_buku,
    };
    await detailkeranjang.create(detailBeli);

    await keranjang.update(
      {
        qty: detailBeli.qty,
        total: detailBeli.hargaAkhir,
      },
      {
        where: {
          id_keranjang: id_keranjang,
          id_user: request.user.id,
        },
      }
    );
  } else {
    const id_keranjang = cekKeranjang.id;

    console.log(id_keranjang);

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
        id_keranjang: id_keranjang,
        id_buku: request.body.id_buku,
        qty: request.body.qty,
        total: request.body.qty * bukuData.harga_buku,
      };
      await detailkeranjang.create(detailBeli);
    }
  }
  await this.hitungAkhir(response, request.user.id);
  return response.json({
    success: true,
    message: " keranjang baru dan buku telah masuk di keranjang",
  });
};

exports.hitungAkhir = async (response, id) => {
  const userKeranjang = await keranjang.findOne({
    where: { id_user: id, status: "pending" },
  });

  const id_keranjang = userKeranjang.id;
  if (!id_keranjang) {
    return response.json({
      success: false,
      message: "keranjang not found, go shop",
    });
  }

  totalharga = await detailkeranjang.sum("total", {
    where: { id_keranjang: id_keranjang },
  });

  await keranjang.update({ total_transaksi: totalharga }, { where: { id: id_keranjang } });
};

exports.removeproduct = async (request, response) => {
  const id = request.params.id;
  try {
    const userCart = await keranjang.findOne({
      where: { id_user: request.user.id, status: "pending" },
    });
    console.log(userCart.id);
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
  const iduser = request.user.id;

  const keranjangUser = await keranjang.findOne({
    where: { id_user: iduser, status: "pending" },
  });

  const detailker = await detailkeranjang.findOne({
    where: { id_keranjang: keranjangUser.id },
  });

  const bukuda = await buku.findOne({
    where: { id: detailker.id_buku },
  });

  if (!keranjangUser) {
    return response.json({
      success: false,
      message: "cart not found",
    });
  } else {
    const snap = new midCli.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-bIfVZE_zjyx3IYHTHzji5NEQ",
      clientKey: "SB-Mid-client-OI2y6xAq4D-Dwx5i",
    });

    const total = parseInt(keranjangUser.total_transaksi);

    const random = Math.random(10);

    //paymentgateway
    const parameters = {
      transaction_details: {
        order_id: `INV-${random}`,
        gross_amount: total,
      },
      callbacks: {
        success: "https://localhost:3000",
        pending: "https://localhost:3000/pending",
        failure: "",
      },
    };

    // console.log(snap);
    let transactionToken;
    let transactionUrl;
    snap.createTransaction(parameters).then((transaction) => {
      transactionToken = transaction.token;
      transactionUrl = transaction.redirect_url;

      return response.json({
        success: true,
        token: transactionToken,
        redirect_url: transactionUrl,
        message: "checkout berhasil",
      });
    });

    const upQty = bukuda.stok_buku - detailker.qty;
    await buku.update({ stok_buku: upQty }, { where: { id: detailker.id } });
    await keranjang.update({ status: "paid" }, { where: { id_user: iduser, status: "pending" } });

    // await detailkeranjang.findOne({ where: { id_keranjang: keranjangUser.id } });
  }
};

const updateStatusMidtrans = async (order_id, data) => {};

exports.notif = async (request, response) => {
  const data = request.body;

  response.json({
    status: "success",
    message: "OK",
  });
};
