import negotiateModel from "../models/negotiate.js";

const getNegotiation = async(req, res) => {
    const userId = req.userId;
    try {
        const negotiation = await negotiateModel.find();
        if (!negotiation) {
            return res.status(404).json({ message: "Negotiation not found" });
        }
        return res.status(200).json({ data : negotiation });
    } catch (error) {
        console.error("Error fetching negotiation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export default getNegotiation;