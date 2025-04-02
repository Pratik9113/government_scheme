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
import Razorpay from "razorpay";
import crypto from 'node:crypto';

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


console.log(process.env.RAZORPAY_KEY_SECRET)
console.log(process.env.RAZORPAY_KEY_ID)


app.use("/user", LoginRouter);
app.use("/event", EventRouter);
app.use("/farmer", NegotiateRouter);
app.use("/scheme", schemeRouter);
app.use("/api/farmer-assistant/chat", farmerChat);
app.use("/user-prompt", PromptRouter);
app.use("/vendor", VendorRouter);



// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Create Order
app.post('/razorpay/order', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }
        const options = {
            amount: amount * 100, // Razorpay works in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/razorpay/verify', async (req, res) => {
  try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({ error: 'Missing payment details' });
      }

      const sha = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = sha.digest('hex');

      if (generatedSignature !== razorpay_signature) {
          return res.status(400).json({ error: 'Invalid payment signature' });
      }

      res.json({
          success: true,
          message: 'Payment verified successfully',
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
      });
  } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



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