/** load library express */
const express = require(`express`);
/** initiate object that instance of express */
const app = express();
/** allow to read 'request' with json type */
app.use(express.json());

/** load event's controller */
const bukuController = require(`../controllers/buku.controller`);

const { authorize, authenticate, authlog } = require("../controllers/auth.controller");

const { IsUser, IsAdmin } = require("../middleware/role-validation");

/** create route to get data with method "GET" */
app.get("/getAll", authorize, bukuController.getAllBuku);
/** create route to find event
 * using method "GET" and define parameter key for "keyword"
 *
 */

app.get("/getBukubyKategori", authorize, bukuController.getBukubyKategori);

app.post("/find", authorize, bukuController.findBuku);
/** create route to add new event using method "POST" */
app.post("/add", authorize, IsAdmin, bukuController.addBuku);
/** create route to update event
 * using method "PUT" and define parameter for "id" */
app.put("/:id", authorize, IsAdmin, bukuController.updateBuku);
/** create route to delete event
 * using method "DELETE" and define parameter for "id" */
app.delete("/delete/:id", authorize, IsAdmin, bukuController.deleteBuku);
/** export app in order to load in another file */
module.exports = app;
