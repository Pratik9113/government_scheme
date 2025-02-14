const express = require("express");
const { loginController, signupController } = require("../controllers/loginController.js");
const LoginRouter = express.Router();

LoginRouter.post("/login", loginController);
LoginRouter.post("/signup", signupController);

module.exports = LoginRouter;
