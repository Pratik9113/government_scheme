import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const RazorpayRouter = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

// Create Order
RazorpayRouter.post('/order', async (req, res) => {
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
            key: process.env.KEY_ID,
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify Payment
RazorpayRouter.post('/verify', async (req, res) => {
  try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({ error: 'Missing payment details' });
      }

      const sha = crypto.createHmac('sha256', process.env.KEY_SECRET);
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


export default RazorpayRouter;
