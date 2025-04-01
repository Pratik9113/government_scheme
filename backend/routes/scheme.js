import express from "express";
import { getSchemeController } from "../controllers/scheme.js";

const schemeRouter = express.Router();

schemeRouter.get("/getScheme", getSchemeController);

export { schemeRouter };
