import mongoose from "mongoose";
const negotiateSchema = new mongoose.Schema({
    grainType: { type: String, required: true },
    availableQuantity: { type: Number, required: true },
    pricePerKg: { type: Number, required: true },
    description: { type: String, required: true },
    cropType: { type: String, required: true },
    farmer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the farmer (User model)
        required: true 
    },
    buyer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const negotiateModel = mongoose.models.Negotiate || mongoose.model('Negotiate', negotiateSchema);
export default negotiateModel;