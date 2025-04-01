import express from "express";
import LoginRouter from "./routes/authenticationRoute.js";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
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
import { sendSMS } from "./send.js";
import NegotiateRouter from "./routes/negotiate.js";
import { schemeRouter } from "./routes/scheme.js";
import  farmerChat  from "./controllers/chatbot.js";
import PromptRouter from "./routes/promptRoute.js";

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

io.on('connection', (socket) => {
    console.log("New Client Is connected");
    socket.on('enrollment', async (eventId) => {
        try {
            const event = await EventModel.findByIdAndUpdate(
                eventId, 
                { $inc: { attendeesCount: 1 } }, 
                { new: true }
            );
            if (event) {
                io.emit('updateAttendeeList', event);
            } else {
                console.log("Event not found.");
            }
        } catch (error) {
            console.error("Error updating event:", error);
        }
    });

    socket.on('farmerChatMessage', async (messageData) => {
        try {
            // Process the message and emit response back to client
            const response = await getFarmerAssistantResponse(messageData.message);
            socket.emit('farmerChatResponse', {
                message: response,
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Error in farmer chat:", error);
            socket.emit('farmerChatResponse', {
                message: "Sorry, I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date(),
                error: true
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


// Define routes

app.post('/sms', async (req, res) => {
    const vendorMessage = req.body.Body; 
    const from = req.body.From; 
    const to = req.body.To; 

    console.log(`Message received from ${from}: ${vendorMessage} : ${to}`);

    const input = `Message received from ${from}: ${vendorMessage} : ${to}`;

    try {
        const response = await axios.post("http://127.0.0.1:5000/negotiate", { input, from });
        const twiml = new MessagingResponse();
        twiml.message(response.data.response); 
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    } catch (error) {
        console.error("Error negotiating:", error.message);
        const twiml = new MessagingResponse();
        twiml.message("An error occurred. Please try again later.");
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    }
});


app.use("/user", LoginRouter);
app.use("/event", EventRouter);
app.use("/farmer", NegotiateRouter);
app.use("/scheme", schemeRouter);
app.use("/api/farmer-assistant/chat", farmerChat);
app.use("/user-prompt", PromptRouter);


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