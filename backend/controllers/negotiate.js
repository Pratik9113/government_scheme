const axios = require("axios");
const negotiateModel = require("../models/negotiate");
const { sendSMS } = require("../send");

const buyerNegotiateController = async (req, res) => {  
    const userId = req.userId;
    const { grainType, cropType, pricePerKg, availableQuantity, description} = req.body; 

    try {
        const buyerNegotiation = new negotiateModel({
            grainType, 
            cropType, 
            pricePerKg, 
            availableQuantity, 
            description
        });

        await buyerNegotiation.save();
        console.log("Negotiation saved successfully");

        const sellerPhones = [
            { "phone": "whatsapp:+917999505967", "name": "Rahul Traders" },
        ];

        const tasks = sellerPhones.map(async (vendor) => {
            try {
                await sendSMS(notes, vendor.phone);
                console.log(`Message sent to ${vendor.phone}`);

                const response = await axios.post("http://127.0.0.1:5000/send_msg_from_farmer", {
                    userId: userId,
                    input: notes,
                    to: vendor.phone,
                    grainType: grainType,
                    quantity: availableQuantity,
                    pricePerKg: pricePerKg,
                });

                console.log(response.data);
                return { vendor: vendor.phone, status: "Success" };
            } catch (error) {
                console.error(`Error sending message to ${vendor.phone}:`, error.message);
                return { vendor: vendor.phone, status: "Failed", error: error.message };
            }
        });

        const results = await Promise.all(tasks); 

        return res.status(200).json({ success: true, message: "Successfully sent", results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = buyerNegotiateController;
