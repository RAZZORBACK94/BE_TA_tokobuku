const { Transaction, where, or } = require("sequelize");
const user = require("../models/index").user;
const buku = require("../models/index").buku;
const keranjang = require(`../models/index`).keranjang;
const detailkeranjang = require(`../models/index`).detail_keranjang;
const midCli = require("midtrans-client");
const cryptohash = require("crypto-js/sha512");

const Op = require(`sequelize`).Op;

exports.addtoKeranjang = async (request, response) => {
  let keranjangData = {
    id_user: request.user.id,
    status: "pending",
    order_id: `INV-${Math.random(10)}`,
  };

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
      total: request.body.qty * bukuData.harga_buku,
    };
    await detailkeranjang.create(detailBeli);

    console.log(detailBeli);

    await keranjang.update(
      {
        qty: detailBeli.qty,
        total_transaksi: detailBeli.hargaAkhir,
      },
      {
        where: {
          id_keranjang: id_keranjang,
          id_user: request.user.id,
        },
      }
    );
    await this.hitungAkhir(response, request.user.id);
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
      await this.hitungAkhir(response, request.user.id);
    } else {
      const detailBeli = {
        id_keranjang: id_keranjang,
        id_buku: request.body.id_buku,
        qty: request.body.qty,
        total: request.body.qty * bukuData.harga_buku,
      };
      await detailkeranjang.create(detailBeli);
      await this.hitungAkhir(response, request.user.id);
    }
    await this.hitungAkhir(response, request.user.id);
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

  console.log(keranjangUser);

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

    const order_id = keranjangUser.order_id;

    //paymentgateway
    const parameters = {
      transaction_details: {
        order_id: order_id,
        gross_amount: total,
      },
      callbacks: {
        success: "https://localhost:3000",
        pending: "https://localhost:3000/pending",
        failure: "https://localhost:3000/keranjang",
      },
    };

    console.log(parameters.transaction_details.order_id);

    // built SNAP
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
      // updateStatusMidtrans(order_id);
    });

    // const upQty = bukuda.stok_buku - detailker.qty;
    // await buku.update({ stok_buku: upQty }, { where: { id: detailker.id } });
    // await keranjang.update({ status: "paid" }, { where: { id_user: iduser, status: "pending" } });

    // await detailkeranjang.findOne({ where: { id_keranjang: keranjangUser.id } });
  }
};

// const updateStatusMidtrans = async (order_id) => {
//   const url = `https://api.sandbox.midtrans.com/v2/${order_id}/status`;
//   const options = { method: "GET", headers: { accept: "application/json", authorization: "Basic U0ItTWlkLXNlcnZlci1iSWZWWkVfemp5eDNJWUhUSHpqaTVORVE6" } };

//   const data = fetch(url, options)
//     .then((res) => res.json())
//     .then((data) => {
//       return data;
//     });

//   if (data.status_code != 200) {
//     return {
//       status: data.statusCode,
//       message: "status code bukan 200",
//     };
//   }

// if (data.signature_key !== verifiykey) {
//   return {
//     status: error,
//     message: "Invalid signature key",
//   };
// }
// let responeData = null;
// let transactionStatus = data.transaction_status;
// let fraudStatus = data.fraud_status;

// if (transactionStatus == "capture") {
//   if (fraudStatus == "accept") {
//     responeData = await keranjang.update({ status: "paid" }, { where: { id: order_id, status: "pending" } });
//     console.log("paid");
//   }
// } else if (transactionStatus == "settlement") {
//   responeData = await keranjang.update({ status: "paid" }, { where: { id: order_id, status: "pending" } });
//   console.log("paid");
// } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
//   responeData = await keranjang.update({ status: "cancel" }, { where: { id: order_id, status: "pending" } });
//   console.log("cancel");
// } else if (transactionStatus == "pending") {
//   console.log("waiting for payment");
// }

exports.notif = async (order_id, data) => {
  await keranjang
    .findOne({
      where: { order_id: order_id },
    })
    .then((trans) => {
      if (trans) {
        updateStatusMidtrans(order_id, data);
      }
    });

  return {
    status: "success",
    message: "OK",
  };
};
