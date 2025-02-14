const express = require("express");
const { eventController, getAllEventController, getEventControllerForEventManager, registerStudentForEventController } = require("../controllers/eventController.js");
const jwtAuth = require("../middlewares/jwtAuth.js");
const upload = require("../multer.js");
const EventRouter = express.Router();

EventRouter.post("/create", jwtAuth, upload.single("image"), eventController);
EventRouter.get("/all", getAllEventController); 
EventRouter.get("/all-user",jwtAuth, getEventControllerForEventManager);
EventRouter.post("/register", jwtAuth, registerStudentForEventController);

module.exports = EventRouter;