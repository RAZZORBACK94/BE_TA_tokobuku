const express = require(`express`);
/** initiate object that instance of express */
const app = express();
/** allow to read 'request' with json type */
app.use(express.json());

const keranjangController = require(`../controllers/keranjang.controllers`);

app.get("/getKeranjang/:id", keranjangController.getKeranjang);

module.exports = app;
