import axios from "axios";
const farmerChat = async (req, res) => {
    try {
        const { message } = req.body;
        const responseText = await getChatbotResponse(message);
        res.json({ response: responseText });
    } catch (error) {
        console.error("❌ Error with Groq API:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get response from chatbot." });
    }
};

// Fetch response from Groq API
const getChatbotResponse = async (userMessage) => {
    const apiKey = process.env.CHATBOT_GROQ_API?.trim();
    if (!apiKey) {
        console.error("❌ Groq API Key is missing.");
        return "Error: API key is missing.";
    }

    try {
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama3-8b-8192",
            messages: [
                { role: "system", content: "You are Kisan Mitra, an assistant for Indian farmers." },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 1024
        }, { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("❌ Groq API error:", error.response?.data || error.message);
        return "Sorry, I'm having trouble responding right now. Please try again later.";
    }
};

export default farmerChat;
