const express = require("express");
const { getSchemeController } = require("../controllers/scheme");
const schemeRouter  = express.Router();
schemeRouter.get("/getScheme", getSchemeController);
module.exports = {schemeRouter};