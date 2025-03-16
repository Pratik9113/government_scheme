const express = require("express");
const LoginRouter = require("./routes/authenticationRoute.js");
const connectDB = require("./config/db.js");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const EventRouter = require("./routes/eventRoute.js");
const EventModel = require("./models/EventSchema.js");
const axios = require("axios"); // Add axios for API calls

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
    origin: "http://localhost:5173", 
    credentials: true, // Allow credentials (cookies)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


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
    
    // New socket event for farmer chatbot interactions
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

// Farmer Assistant Chatbot API endpoint
app.post("/api/farmer-assistant/chat", async (req, res) => {
    try {
        const { message } = req.body;
        const responseText = await getFarmerAssistantResponse(message);
        res.json({ response: responseText });
    } catch (error) {
        console.error('Error with Groq API:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to get response from assistant',
            details: error.message 
        });
    }
});

// Function to get response from Groq API
async function getFarmerAssistantResponse(userMessage) {
    console.log("Groq API Key:", process.env.GROQ_API_KEY);
    const apiKey = process.env.GROQ_API_KEY?.trim(); // Ensure no whitespace issues

    if (!apiKey) {
        console.error("Groq API Key not found. Please provide a valid key.");
        return "Error: API key is missing.";
    }

    try {
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant named Kisan Mitra who specializes in information about Indian government schemes for farmers."
                },
                {
                    role: "user",
                    content: userMessage // User's input message
                }
            ],
            temperature: 0.7,
            max_tokens: 1024
        }, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        // ✅ Extract and log the chatbot's response
        const botMessage = response.data.choices[0].message.content;
        console.log("Chatbot Response:", botMessage);

        return botMessage; // ✅ Return actual chatbot message
    } catch (error) {
        console.error("Error with Groq API:", error.response ? error.response.data : error.message);
        return "Sorry, I'm having trouble responding right now. Please try again later.";
    }
}


// Example usage
getFarmerAssistantResponse("Tell me about PM-KISAN");
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