import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROQ_API_KEY = process.env.digikissan;
if (!GROQ_API_KEY) {
  throw new Error("API key not found. Please set digikissan in .env file.");
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Store for sessions + chat history
const negotiationSessions = {};
const chatHistory = {}; // { sessionId: [ {role, content}, ... ] }

// Utility: Build base system prompt
const createBasePrompt = ({
  grainType = "",
  basePricePerKg = 0,
  minPricePerKg = 0,
  cropType = "",
  description = "",
  quantity = 0,
}) => {
  return {
    role: "system",
    content: `
You are an AI agent negotiating with a buyer interested in ${grainType}.
- **Listed price per kg**: ₹${basePricePerKg}
- **Minimum acceptable price per kg**: ₹${minPricePerKg}

**Negotiation Rules:**
1. Offer a fair price based on the buyer's quantity of ${quantity} kg.
2. Always respond with:
   - "Final negotiated price: ₹X per kg for Y kg"
   (Replace X with the negotiated price per kg, and Y with the quantity)
3. Do not add any extra text after stating the final price and quantity.

Example response:
- "Final negotiated price: ₹38 per kg for 45 kg"
    `,
  };
};

// Controller: Create new negotiation session
export const createNegotiation = (req, res) => {
  try {
    const { negotiationId, userId, grainType, pricePerKg, quantity, cropType, description } =
      req.body;

    if (!negotiationId || !userId) {
      return res.status(400).json({ error: "negotiationId and userId are required" });
    }

    if (negotiationId in negotiationSessions) {
      return res.status(409).json({ error: "Negotiation session already exists" });
    }

    negotiationSessions[negotiationId] = {
      userId,
      grainType,
      basePricePerKg: pricePerKg,
      minPricePerKg: Math.floor(pricePerKg * 0.94),
      quantity,
      cropType,
      description,
      negotiatedPricePerKg: null,
      negotiatedQuantity: null,
    };

    chatHistory[userId] = []; // initialize chat history

    return res.status(201).json({
      message: "Negotiation session created successfully",
      negotiationId,
      status: "created",
    });
  } catch (err) {
    console.error("Error in createNegotiation:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Controller: Negotiate
export const negotiate = async (req, res) => {
  try {
    const { negotiationId, userId, message, grainType, pricePerKg, quantity, cropType, description } =
      req.body;

    if (!negotiationSessions[negotiationId]) {
      negotiationSessions[negotiationId] = {
        userId,
        grainType,
        basePricePerKg: pricePerKg,
        minPricePerKg: Math.floor(pricePerKg * 0.94),
        quantity,
        cropType,
        description,
        negotiatedPricePerKg: null,
        negotiatedQuantity: null,
      };
    }

    // If buyer says "deal done"
    if (/deal done/i.test(message)) {
      const finalPricePerKg = negotiationSessions[negotiationId].negotiatedPricePerKg;
      const negotiatedQuantity = negotiationSessions[negotiationId].negotiatedQuantity;

      if (!finalPricePerKg || !negotiatedQuantity) {
        return res.status(400).json({ error: "No negotiated price or quantity available." });
      }

      const totalPrice = finalPricePerKg * negotiatedQuantity;
      return res.json({
        reply: `Status: Deal done! ✅ The final amount is ₹${totalPrice}. You can proceed with the payment.`,
        showDealButton: true,
        totalPrice,
        negotiationId,
        pricePerKg: finalPricePerKg,
        quantity: negotiatedQuantity,
      });
    }

    // Chat history
    if (!chatHistory[userId]) chatHistory[userId] = [];

    // Add user message
    chatHistory[userId].push({ role: "user", content: message });

    // Prepare messages
    const session = negotiationSessions[negotiationId];
    const systemPrompt = createBasePrompt(session);

    const messages = [systemPrompt, ...chatHistory[userId]];

    // Call Groq API
    const groqRes = await axios.post(
      GROQ_URL,
      {
        model: "gemma2-9b-it",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = groqRes.data.choices[0].message.content;

    // Save bot message to history
    chatHistory[userId].push({ role: "assistant", content: aiResponse });

    // Extract negotiated price + quantity
    const regex = /Final negotiated price:\s*₹(\d+(?:\.\d+)?)\s*per kg for (\d+)\s*kg/i;
    const match = aiResponse.match(regex);

    if (match) {
      const negotiatedPricePerKg = parseFloat(match[1]);
      const negotiatedQuantity = parseInt(match[2]);

      session.negotiatedPricePerKg = negotiatedPricePerKg;
      session.negotiatedQuantity = negotiatedQuantity;

      const totalPrice = negotiatedPricePerKg * negotiatedQuantity;

      return res.json({
        reply: `Final negotiated price: ₹${negotiatedPricePerKg} per kg for ${negotiatedQuantity} kg. Total amount: ₹${totalPrice}.`,
        showDealButton: false,
        totalPrice,
        negotiationId,
        pricePerKg: negotiatedPricePerKg,
        quantity: negotiatedQuantity,
      });
    }

    return res.json({ reply: aiResponse, showDealButton: false });
  } catch (err) {
    console.error("Error in negotiate:", err);
    return res.status(500).json({ error: err.message });
  }
};
