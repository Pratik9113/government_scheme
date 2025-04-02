import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
    negotiation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negotiate', // Linking to the Negotiation model
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Linking to the User model
        required: true
    },
    quantity: { 
        type: Number, 
        required: true,
        min: 1 // Minimum purchase should be at least 1kg
    },
    pricePerKg: { 
        type: Number, 
        required: true 
    },
    totalAmount: { 
        type: Number, 
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });

const BuyerModel = mongoose.models.Buyer || mongoose.model('Buyer', buyerSchema);
export default BuyerModel;
