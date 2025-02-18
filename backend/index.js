const express = require("express");
const LoginRouter = require("./routes/authenticationRoute.js");
const connectDB = require("./config/db.js");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require('http');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
dotenv.config();
const cookieParser = require("cookie-parser");
const EventRouter = require("./routes/eventRoute.js");
const EventModel = require("./models/EventSchema.js");
const { default: axios } = require('axios');

const {createServer} = require("http"); 
const {Server} = require("socket.io");
const node_cron = require("./node-cron.js");
const { sendSMS } = require("./send.js");


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

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// WebSocket connection for real-time updates
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




const vendors = [
    "whatsapp:+917999505967",
];
const message = "I am looking to purchase wheat in bulk. My requirement is [100 quintals]. My budget is ₹35,000. Please provide your price quote";

(async () => {
    for (const vendor of vendors) {
        try {
            await sendSMS(message, vendor);
            console.log(`Message sent to ${vendor}`);
            const response = await axios.post("http://127.0.0.1:5000/send_msg_from_farmer", { input: message, to: vendor });
            console.log(`Message pushed to Flask server: ${response.data}`);
        } catch (error) {
            console.log(`Error sending SMS to ${vendor}:`, error.message);
        }
    }
})();




http.createServer(app).listen(1334, () => {
    console.log(`Twilio webhook server running on port 1334`);
});



// Connect to the database
connectDB();

// Call Node cron 
node_cron();

// Start the server and listen on the correct port
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
