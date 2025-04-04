from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq
from langchain_community.chat_message_histories import ChatMessageHistory
from flask_cors import CORS
import traceback
from db_connection import db
import re 

app = Flask(__name__)
CORS(app)  
load_dotenv()  

api_key = os.getenv("digikissan")
if not api_key:
    raise ValueError("API key not found. Please set it in the .env file.")

model = ChatGroq(model="gemma2-9b-it", groq_api_key=api_key)

store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

negotiation_sessions = {}

def create_base_prompt(grainType="", basePricePerKg=0, minPricePerKg=0, cropType="", description="", quantity=0):
    messages = [
        SystemMessage(content=f"""
        You are an AI agent negotiating with a buyer interested in {grainType}.
        - **Listed price per kg**: ₹{basePricePerKg}
        - **Minimum acceptable price per kg**: ₹{minPricePerKg}
        
        **Negotiation Rules:**
        1. Offer a fair price based on the buyer's quantity of {quantity} kg.
        2. Always respond with:
            - **"Final negotiated price: ₹X per kg for Y kg"** 
            (Replace X with the negotiated price per kg, and Y with the quantity)
        3. Do not add any extra text after stating the final price and quantity.
        
        Example response:
        - "Final negotiated price: ₹38 per kg for 45 kg"
        """),
        MessagesPlaceholder(variable_name="messages"),
    ]
    
    return ChatPromptTemplate(messages=messages)

@app.route('/create', methods=['POST'])
def create_negotiation():
    try:
        data = request.json
        negotiation_id = data.get("negotiationId")
        user_id = data.get("userId")
        
        if not negotiation_id or not user_id:
            return jsonify({"error": "negotiationId and userId are required"}), 400
            
        if negotiation_id in negotiation_sessions:
            return jsonify({"error": "Negotiation session already exists"}), 409
            
        negotiation_sessions[negotiation_id] = {
            "userId": user_id,
            "grainType": data.get("grainType"),
            "basePricePerKg": data.get("pricePerKg"),
            "minPricePerKg": int(data.get("pricePerKg") * 0.94),
            "quantity": data.get("quantity"),
            "cropType": data.get("cropType"),
            "description": data.get("description"),
            "negotiatedPricePerKg": None,
            "negotiatedQuantity": None,
        }
        
        return jsonify({
            "message": "Negotiation session created successfully",
            "negotiationId": negotiation_id,
            "status": "created"
        }), 201
        
    except Exception as e:
        print("Error occurred:", str(e))
        print("Stack trace:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/negotiate', methods=['POST'])
def negotiate():
    try:
        data = request.json
        user_message = data.get("message", "")

        negotiation_id = data.get("negotiationId")
        user_id = data.get("userId")

        if negotiation_id not in negotiation_sessions:
            negotiation_sessions[negotiation_id] = {
                "userId": user_id,
                "grainType": data.get("grainType"),
                "basePricePerKg": data.get("pricePerKg"),
                "minPricePerKg": int(data.get("pricePerKg") * 0.94),
                "quantity": data.get("quantity"),
                "cropType": data.get("cropType"),
                "description": data.get("description"),
                "negotiatedPricePerKg": None,  
                "negotiatedQuantity": None,  
            }

        if re.search(r'\bdeal done\b', user_message, re.IGNORECASE):
            final_price_per_kg = negotiation_sessions[negotiation_id].get("negotiatedPricePerKg")
            quantity = negotiation_sessions[negotiation_id].get("negotiatedQuantity")

            if final_price_per_kg is None or quantity is None:
                return jsonify({"error": "No negotiated price or quantity available."}), 400

            total_price = final_price_per_kg * quantity

            return jsonify({
                "reply": f"Status: Deal done! ✅ The final amount is ₹{total_price}. You can proceed with the payment.",
                "showDealButton": True,
                "totalPrice": total_price,
                "negotiationId": negotiation_id,  
                "pricePerKg": final_price_per_kg,  # Negotiated price
                "quantity": quantity  # Negotiated quantity
            })

        chain = create_base_prompt(
            grainType=negotiation_sessions[negotiation_id]["grainType"],
            basePricePerKg=negotiation_sessions[negotiation_id]["basePricePerKg"],
            minPricePerKg=negotiation_sessions[negotiation_id]["minPricePerKg"],
            cropType=negotiation_sessions[negotiation_id]["cropType"],
            description=negotiation_sessions[negotiation_id]["description"],
            quantity=negotiation_sessions[negotiation_id]["quantity"]
        ) | model

        with_message_history = RunnableWithMessageHistory(chain, get_session_history)
        ai_response = with_message_history.invoke(
            [HumanMessage(content=user_message)],
            config={"configurable": {"session_id": user_id}}
        )

        price_quantity_match = re.search(r'Final negotiated price:\s*₹(\d+(?:\.\d+)?)\s*per kg for (\d+) kg', ai_response.content)

        if price_quantity_match:
            negotiated_price_per_kg = float(price_quantity_match.group(1))
            negotiated_quantity = int(price_quantity_match.group(2))

            negotiation_sessions[negotiation_id]["negotiatedPricePerKg"] = negotiated_price_per_kg
            negotiation_sessions[negotiation_id]["negotiatedQuantity"] = negotiated_quantity

            total_price = negotiated_price_per_kg * negotiated_quantity

            return jsonify({
                "reply": f"Final negotiated price: ₹{negotiated_price_per_kg} per kg for {negotiated_quantity} kg. Total amount: ₹{total_price}.",
                "showDealButton": False,
                "totalPrice": total_price,
                "negotiationId": negotiation_id,  
                "pricePerKg": negotiated_price_per_kg,
                "quantity": negotiated_quantity
            })

        return jsonify({"reply": ai_response.content, "showDealButton": False})

    except Exception as e:
        print("Error occurred:", str(e))
        print("Stack trace:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    
    
if __name__ == '__main__':
    app.run(debug=True) 