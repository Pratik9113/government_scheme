import express from "express";
import LoginRouter from "./routes/authenticationRoute.js";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import bodyParser from "body-parser";

import pkg from 'twilio';
const { twiml } = pkg;
import cookieParser from "cookie-parser";
import EventRouter from "./routes/eventRoute.js";
import EventModel from "./models/EventSchema.js";
import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";
import NegotiateRouter from "./routes/negotiate.js";
import { schemeRouter } from "./routes/scheme.js";
import  farmerChat  from "./controllers/chatbot.js";
import PromptRouter from "./routes/promptRoute.js";
import VendorRouter from "./routes/vendor.js";

const app = express();
const server = createServer(app); 
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173"
        ],
        methods: ["GET", "POST"],
        credentials:true,
    }
});


// CORS configuration for frontend
app.use(cors({
    origin: [
        "http://localhost:5173"
    ], 
    credentials: true, // Allow credentials (cookies)
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/user", LoginRouter);
app.use("/event", EventRouter);
app.use("/farmer", NegotiateRouter);
app.use("/scheme", schemeRouter);
app.use("/api/farmer-assistant/chat", farmerChat);
app.use("/user-prompt", PromptRouter);
app.use("/vendor", VendorRouter);
app.use("/razorpay",);


// http.createServer(app).listen(1332, () => {
//     console.log(`Twilio webhook server running on port 1332`);
// });



// Connect to the database
connectDB();



// Start the server and listen on the correct port
const port = process.env.PORT || 3003;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});