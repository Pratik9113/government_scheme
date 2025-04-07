import express from "express";
import { buyerNegotiateController, deleteNegotiation, getAllNegotiations, updateNegotiation } from "../controllers/negotiate.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const NegotiateRouter = express.Router();

NegotiateRouter.post("/farmer-submission-form", jwtAuth, buyerNegotiateController);
NegotiateRouter.get("/get-farmer-crop", jwtAuth, getAllNegotiations);
NegotiateRouter.patch("/crop-update/:id", jwtAuth, updateNegotiation);
NegotiateRouter.delete("/delete-product/:id", jwtAuth, deleteNegotiation);

export default NegotiateRouter;