import express from "express";
import { createNegotiation, negotiate } from "../controllers/NegotiateController.js";

const negotiationRoutes = express.Router();

negotiationRoutes.post("/create", createNegotiation);
negotiationRoutes.post("/negotiate", negotiate);

export default negotiationRoutes;
