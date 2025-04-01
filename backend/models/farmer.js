import mongoose from "mongoose";

const negotiateSchema = new mongoose.Schema({
    grainType: { type: String, required: true },
    cropType: { type: String, required: true },
    availableQuantity: { type: Number, required: true },
    pricePerKg: { type: Number, required: true },
    description: { type: String, required: true },
    buyers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Buyer" }], 
    createdAt: { type: Date, default: Date.now },
});

const negotiateModel = mongoose.models.negotiate || mongoose.model("negotiate", negotiateSchema);

export default negotiateModel;
