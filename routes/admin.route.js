/** load library express */
const express = require(`express`)
/** initiate object that instance of express */
const app = express()
/** allow to read 'request' with json type */
app.use(express.json())

/** load user's controller */
const adminController = require(`../controllers/admin.controller`)

/** create route to get data with method "GET" */
app.get("/", adminController.getAllAdmin)

/** create route to find user
*using method "GET" and define parameter "key" for keyword */
app.get("/:key", adminController.findAdmin)

/** create route to add new user using method "POST" */
app.post("/", adminController.addAdmin)

/** create route to update user 
* using method "PUT" and define parameter for "id" */
app.put("/:id", adminController.updateAdmin)

/** create route to delete user 
* using method "DELETE" and define parameter for "id" */
app.delete("/:id", adminController.deleteAdmin)

/** export app in order to load in another file */
module.exports = app