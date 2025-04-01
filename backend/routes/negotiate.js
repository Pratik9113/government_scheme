import express from "express";
import buyerNegotiateController from "../controllers/negotiate.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const NegotiateRouter = express.Router();

NegotiateRouter.post("/farmer-submission-form", jwtAuth, buyerNegotiateController);

export default NegotiateRouter;
