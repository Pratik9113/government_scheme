import mongoose from "mongoose";
import express from "express";
import { loginController, signupController } from "../controllers/loginController.js";
const LoginRouter = express.Router();

LoginRouter.post("/login", loginController);
LoginRouter.post("/signup", signupController);

export default LoginRouter;
