const express = require(`express`);
/** initiate object that instance of express */
const app = express();
/** allow to read 'request' with json type */
app.use(express.json());

const TransaksiController = require("../controllers/transaksi.controller");

const { authorize, authenticate, authlog } = require("../controllers/auth.controller");

app.post("/add", authorize, TransaksiController.addtoKeranjang);

app.post("/remove/:id", authorize, TransaksiController.removeproduct);

app.post("/checkout", authorize, TransaksiController.checkout);

app.post("/notification", TransaksiController.notif);

module.exports = app;
