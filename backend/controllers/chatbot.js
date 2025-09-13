import axios from "axios";
import SchemaModel from "../models/SchemeModels.js";

const farmerChat = async (req, res) => {
    try {
        const { message } = req.body;

       const allSchemes = await SchemaModel.find({}, { embedding: 0 }).limit(5).lean();
       const formattedSchemes = allSchemes.map((s, i) => 
            `(${i + 1}) Title: ${s.title}
        State: ${s.state}
        Tags: ${Array.isArray(s.tags) ? s.tags.join(", ") : "N/A"}
        Steps: ${s.steps}
        Description: ${s.description ?? "N/A"}
        Link: ${s.link ?? "N/A"}`
        ).join("\n---\n");

        console.log("debug -> formattedSchemes", formattedSchemes);

        const systemMessage = `You are Kisan Mitra, an assistant for Indian farmers. Use the following schemes to answer the user's question:\n\n${formattedSchemes}`;
        const responseText = await getChatbotResponse(systemMessage, message);
        console.log(responseText)
        res.json({ response: responseText });

    } catch (error) {
        console.error("Error with chatbot handler:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get response from chatbot." });
    }
};

const getChatbotResponse = async (context, userMessage) => {
    const apiKey = process.env.CHATBOT_GROQ_API?.trim();
    console.log("debug -> apikey", apiKey);
    if (!apiKey) {
        console.error("Groq API Key is missing.");
        return "Error: API key is missing.";
    }

    try {
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: context },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 1024
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        return response.data.choices[0].message.content;

    } catch (error) {
        console.error("Groq API error:", error.response?.data || error.message);
        return "Sorry, I'm having trouble responding right now. Please try again later.";
    }
};


export default farmerChat;
