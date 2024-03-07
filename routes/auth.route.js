const express = require("express");

const app = express();

app.use(express.json());

const { authenticate } = require("../controllers/auth.controller");

app.post("/login", authenticate);

module.exports = app;
