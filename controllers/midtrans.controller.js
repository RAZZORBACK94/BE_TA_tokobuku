const midCli = require("midtrans-client");

let snap = midCli.Snap({
  isProduction: false,
  serverkey: process.env.MIDTRANS_SERVER_KEY,
});

let parameter = {
  transaksi_detail: {
    order_id: `INV${Math.random}`,
    gross_amount: hargaakhir,
  },
};

snap.createTransaction(parameter).then((Transaksi) => {
  let TransaksiToken = Transaksi.token;
  console.log("token : ", TransaksiToken);
});
