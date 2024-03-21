/** load library express */
const express = require(`express`);
/** initiate object that instance of express */
const app = express();
/** allow to read 'request' with json type */
app.use(express.json());

/** load user's controller */
const userController = require(`../controllers/user.controller`);

const { validateUser } = require("../middleware/user-validation");

const { authorize, authenticate, authlog } = require("../controllers/auth.controller");

const { IsUser, IsAdmin } = require("../middleware/role-validation");

/** create route to get data with method "GET" */
app.get("/getall", authorize, IsAdmin, userController.getAllUser);

/** create route to find user
 *using method "GET" and define parameter "key" for keyword */
app.get("/find/:key", authorize, IsAdmin, userController.findUser);

/** create route to add new user using method "POST" */
app.post("/add", authorize, IsAdmin, validateUser, userController.addUser);

/** create route to update user
 * using method "PUT" and define parameter for "id" */
app.put("/update/:id", authorize, IsUser, validateUser, userController.updateUser);

/** create route to delete user
 * using method "DELETE" and define parameter for "id" */
app.delete("/delete/:id", authorize, IsAdmin, userController.deleteUser);

app.post("/register", validateUser, userController.register);

app.post("/reset/:id", userController.resetPW);

app.post("/logout/:id", authlog, userController.logout);

/** export app in order to load in another file */
module.exports = app;
