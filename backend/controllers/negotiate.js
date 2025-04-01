import negotiateModel from "../models/negotiate.js";

const buyerNegotiateController = async (req, res) => {  
    const userId = req.userId; 
    const { grainType, cropType, pricePerKg, availableQuantity, description } = req.body; 

    try {
        const buyerNegotiation = new negotiateModel({
            grainType, 
            cropType, 
            pricePerKg, 
            availableQuantity, 
            description
        });

        const savedNegotiation = await buyerNegotiation.save();
        console.log("Negotiation saved successfully");

        return res.status(201).json({ 
            success: true, 
            message: "Farmer", 
            results: savedNegotiation 
        });
    } catch (error) {
        console.error("Error saving negotiation:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
};

export default buyerNegotiateController;
