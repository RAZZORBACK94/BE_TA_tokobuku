/** load library express */
const express = require(`express`);
/** initiate object that instance of express */
const app = express();
/** allow to read 'request' with json type */
app.use(express.json());

/** load event's controller */
const bukuController = require(`../controllers/buku.controller`);
/** create route to get data with method "GET" */
app.get("/getAll", bukuController.getAllBuku);
/** create route to find event
 * using method "GET" and define parameter key for "keyword"
 */
app.get("/:key", bukuController.findBuku);
/** create route to add new event using method "POST" */
app.post("/add", bukuController.addBuku);
/** create route to update event
 * using method "PUT" and define parameter for "id" */
app.put("/:id", bukuController.updateBuku);
/** create route to delete event
 * using method "DELETE" and define parameter for "id" */
app.delete("/delete/:id", bukuController.deleteBuku);
/** export app in order to load in another file */
module.exports = app;
