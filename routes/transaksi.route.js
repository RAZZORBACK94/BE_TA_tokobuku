const express = require(`express`);
/** initiate object that instance of express */
const app = express();
/** allow to read 'request' with json type */
app.use(express.json());

const TransaksiController = require("../controllers/transaksi.controller");

app.post("/add", TransaksiController.addtoKeranjang);

app.post("/remove/:id", TransaksiController.removeproduct);

app.post("/checkout", TransaksiController.checkout);

module.exports = app;
