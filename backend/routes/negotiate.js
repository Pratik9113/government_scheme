const express = require("express");
const buyerNegotiateController = require("../controllers/negotiate");
const jwtAuth = require("../middlewares/jwtAuth");
const NegotiateRouter = express.Router();

NegotiateRouter.post("/farmer-submission-form", jwtAuth, buyerNegotiateController);

module.exports = NegotiateRouter;