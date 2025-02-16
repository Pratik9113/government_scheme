from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq
from langchain_community.chat_message_histories import ChatMessageHistory
import re
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
load_dotenv()

api_key = os.getenv("api_key")
if not api_key:
    raise ValueError("API key not found. Please set it in the .env file.")

model = ChatGroq(model="gemma2-9b-it", groq_api_key=api_key)
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

def create_base_prompt(shopkeeper_msg=""):
    price_match = re.search(r"₹\s?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)", shopkeeper_msg)
    if price_match:
        shopkeeper_amount = int(price_match.group(1).replace(",", ""))
        reduced_amount = int(shopkeeper_amount * 0.9) 
    else:
        raise ValueError("Could not extract a valid price from the shopkeeper's message.")
    
    messages = [
        SystemMessage(content="You are an AI agent negotiating with a vendor."),
        SystemMessage(
            content=(
                f"Shopkeeper says: {shopkeeper_msg}. Extract the shopkeeper's requirements and the quoted price, then reduce the quoted price by 10%, and negotiate accordingly.\n\n"
                "You are an AI agent negotiating with a local vendor. Your goal is to get the best price without exceeding the shopkeeper's actual price. Keep the shopkeeper's actual price confidential. "
                f"The extracted shopkeeper amount is stored as [shopkeeperamount={shopkeeper_amount}] and the reduced amount is stored as [amount={reduced_amount}].\n\n"
                "Follow these steps for negotiation:\n\n"
                "1. **Starting Offer:**\n"
                f"   Begin by offering ₹{reduced_amount}. Say:\n"
                f"   **'Hi! I’m looking to buy this item. I’d like to offer ₹{reduced_amount}. Let me know your thoughts.'**\n\n"
                "2. **Vendor's Offers:**\n"
                f"   - If the vendor quotes **less than or equal to ₹{shopkeeper_amount}**, accept the offer immediately. Do not negotiate further. Confirm with:\n"
                f"     **'Great! We’ve agreed on ₹[agreed price]. We will get back to you regarding the deal and delivery details shortly.'**\n"
                f"     Then, reiterate:\n"
                f"     **'Just to confirm, we’ve agreed on ₹[agreed price]. This price is final and cannot be changed. Would you like to proceed with the delivery arrangements?'**\n\n"
                f"   - If the vendor quotes **above ₹{shopkeeper_amount}**, respond:\n"
                f"     **'I understand your quote, but this ₹{reduced_amount} amount is what I can offer. Let me know if you can revise your offer to fit within this range.'**\n\n"
                "3. **Incremental Counteroffers:**\n"
                f"   - If the vendor rejects, increase your offer incrementally in steps of ₹500-₹1,000 and store in  until you reach ₹{shopkeeper_amount}. After each offer, say:\n"
                f"     **'I understand your quote, but I’d like to offer ₹[new price]. Let me know if this works for you.'**\n"
                f"   - If the vendor proposes a price **below your latest counteroffer but still above ₹{shopkeeper_amount}**, repeat:\n"
                f"     **'₹{reduced_amount} is the maximum I can offer. Let me know if you can adjust your quote accordingly.'**\n\n"
                "4. **Key Rules for Consistency:**\n"
                f"   - If the vendor proposes a price **below or equal to ₹{reduced_amount} at any point**, accept it immediately without further counteroffers or negotiation.\n"
                f"   - Do not counter with a higher price than the vendor's latest offer.\n"
                f"   - Never disclose ₹{shopkeeper_amount} as the maximum budget upfront. Reveal it only when the vendor quotes a price above ₹{shopkeeper_amount}.\n"
                "   - Maintain a polite and professional tone throughout the negotiation process.\n\n"
                "5. **Final Confirmation:**\n"
                f"   Once the vendor agrees to a price ≤ ₹{reduced_amount}, reiterate the agreed price and confirm with:\n"
                f"   **'Just to confirm, we’ve agreed on ₹[agreed price]. This price is final, and no changes will be entertained. Would you like us to proceed with the deal and delivery arrangements?'**"
            )
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
    return ChatPromptTemplate(messages=messages)

@app.route("/sendMsgFromShopkeeper", methods=["POST"])
def sendMsgFromShopkeeper():
    shopkeeper_msg = request.json.get("input", "")
    if not shopkeeper_msg:
        return jsonify({"error": "No input provided for shopkeeper message"}), 400
    global base_prompt_template
    base_prompt_template = create_base_prompt(shopkeeper_msg)
    return jsonify({"message": "Shopkeeper's message stored and prompt updated successfully."})



@app.route("/negotiate", methods=["POST"])
def negotiate():
    input_data = request.json.get("input", "")
    vendor_phno = request.json.get("to", "")
    if not input_data:
        return jsonify({"error": "No input provided"}), 400
    config = {"configurable": {"session_id": vendor_phno}}
    if "base_prompt_template" not in globals():
        return jsonify({"error": "Shopkeeper message not set. Please set it first using /sendMsgFromShopkeeper"}), 400
    chain = base_prompt_template | model
    with_message_history = RunnableWithMessageHistory(chain, get_session_history)

    vendor_message = input_data.lower()
    ai_response = with_message_history.invoke(
        [HumanMessage(content=vendor_message)],
        config=config,
    )

    print(ai_response.content)
    return jsonify({"response": ai_response.content})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
