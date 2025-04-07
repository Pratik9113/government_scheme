import negotiateModel from "../models/negotiate.js";

export const buyerNegotiateController = async (req, res) => {  
    const userId = req.userId; 
    const { grainType, cropType, pricePerKg, availableQuantity, description } = req.body; 

    try {
        const buyerNegotiation = new negotiateModel({
            grainType, 
            cropType, 
            pricePerKg, 
            availableQuantity, 
            description,
            farmer:userId,
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


export const getAllNegotiations = async (req, res) => {
    const userId = req.userId;
    try {
        const negotiations = await negotiateModel.find({farmer:userId});
        console.log(negotiations)
        return res.status(200).json({ success: true, data: negotiations });
    } catch (error) {
        console.error("Error fetching negotiations:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateNegotiation = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const updateFields = req.body;

    try {
        const negotiation = await negotiateModel.findOneAndUpdate(
            { _id: id, farmer: userId },
            updateFields,
            { new: true }
        );

        if (!negotiation) {
            return res.status(404).json({ success: false, message: "Negotiation not found or not authorized" });
        }

        return res.status(200).json({ success: true, message: "Negotiation updated", results: negotiation });
    } catch (error) {
        console.error("Error updating negotiation:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteNegotiation = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const deleted = await negotiateModel.findOneAndDelete({ _id: id, farmer: userId });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Negotiation not found or not authorized" });
        }

        return res.status(200).json({ success: true, message: "Negotiation deleted successfully" });
    } catch (error) {
        console.error("Error deleting negotiation:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
