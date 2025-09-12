import express from "express"
import farmerChat from "../controllers/chatbot.js";
const ChatbotRouter = express.Router();

ChatbotRouter.post('/chat', farmerChat);
export default ChatbotRouter;
