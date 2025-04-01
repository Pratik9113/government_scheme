import express from "express"
import getNegotiation from "../controllers/vendor.js";
import jwtAuth from "../middlewares/jwtAuth.js";
const VendorRouter = express.Router();
VendorRouter.get("/get-all-negotition",jwtAuth, getNegotiation);
export default VendorRouter;