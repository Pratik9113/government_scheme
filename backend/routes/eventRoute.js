import mongoose from "mongoose";
import express from "express";
import { 
    eventController, 
    getAllEventController, 
    getEventControllerForEventManager, 
    registerStudentForEventController 
} from "../controllers/eventController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import upload from "../multer.js";

const EventRouter = express.Router();


EventRouter.post("/create", jwtAuth, upload.single("image"), eventController);
EventRouter.get("/all", getAllEventController); 
EventRouter.get("/all-user",jwtAuth, getEventControllerForEventManager);
EventRouter.post("/register", jwtAuth, registerStudentForEventController);

export default EventRouter;