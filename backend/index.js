const express = require("express");
const LoginRouter = require("./routes/authenticationRoute.js");
const connectDB = require("./config/db.js");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const EventRouter = require("./routes/eventRoute.js");
const EventModel = require("./models/EventSchema.js");

const {createServer} = require("http"); 
const {Server} = require("socket.io");
const node_cron = require("./node-cron.js");


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
app.use("/user", LoginRouter);
app.use("/event", EventRouter);

// Connect to the database
connectDB();

// Call Node cron 
node_cron();

// Start the server and listen on the correct port
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
