import express from "express";
import generate from "../insertData.js";
const insertRouter = express.Router();

insertRouter.get('/generate', generate);

export default insertRouter;