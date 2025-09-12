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
import jwtAuth from "./middlewares/jwtAuth.js";
import negotiateModel from "./models/negotiate.js";
import BuyerModel from "./models/Buyer.js";
import BuyerRouter from "./routes/buyer.js";
import ChatbotRouter from "./routes/ChatbotRoute.js";

const app = express();
const server = createServer(app); 
const io = new Server(server, {
    cors: {
        origin: [
            "https://government-scheme.vercel.app",
            // "http://localhost:5173"
        ],
        methods: ["GET", "POST"],
        credentials:true,
    }
});


// CORS configuration for frontend
app.use(cors({
    origin: [
         "https://government-scheme.vercel.app",
        // "http://localhost:5173"
    ], 
    credentials: true, // Allow credentials (cookies)
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/user", LoginRouter);
app.use("/farmer", NegotiateRouter);
app.use("/scheme", schemeRouter);
app.use("/api/farmer-assistant/chat", farmerChat);
app.use("/user-prompt", PromptRouter);
app.use("/vendor", VendorRouter);
app.use("/buyers", BuyerRouter);
app.use("/bot", ChatbotRouter);



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



app.post('/razorpay/verify',jwtAuth, async (req, res) => {
    const userId = req.userId;
    console.log("User id" , userId);
  try {
      const { id, budget, quantity, priceperkg, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;


      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({ error: 'Missing payment details' });
      }

      const sha = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = sha.digest('hex');

      if (generatedSignature !== razorpay_signature) {
          return res.status(400).json({ error: 'Invalid payment signature' });
      }

      const updatedNegotiate = await negotiateModel.findByIdAndUpdate(
        id,
        { 
            $push: { buyer: userId },
            $inc : {availableQuantity: -quantity} // Decrease available quantity
        }, // Add buyer ID
        { new: true }
    );

    if (!updatedNegotiate) {
        return res.status(404).json({ error: 'Negotiation not found' });
    }

    const totalAmount = quantity * priceperkg;

    const newBuyer = new BuyerModel({
        negotiation: id, // Negotiation ID
        buyer: userId,   // Buyer ID
        quantity,
        pricePerKg: priceperkg,
        totalAmount,
        status: 'Pending', // Default status
    });

    await newBuyer.save();

    res.json({
        success: true,
        message: 'Payment verified & buyer details saved successfully',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        negotiation: updatedNegotiate,
        buyerDetails: newBuyer
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