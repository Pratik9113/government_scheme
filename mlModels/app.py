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

def create_base_prompt(farmer_msg=""):
    # price_match = re.search(r"₹\s?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)", farmer_msg)
    # if price_match:
    #     farmer_amount = int(price_match.group(1).replace(",", ""))
    #     reduced_amount = int(farmer_amount * 0.9) 
    # else:
    #     raise ValueError("Could not extract a valid price from the shopkeeper's message.")
    
    
    farmer_amount = 30000
    reduced_amount = 27000
    item = "wheat"
    
    messages = [
        SystemMessage(content=f"You are an AI agent negotiating with a local person who is interested to buy grain from farmer and make sure the final price does not exceed {farmer_amount} ."),
        SystemMessage(
            content=(
                "You are an AI agent negotiating with a local person. Your goal is to get the best price without exceeding the shopkeeper's actual price. Keep the shopkeeper's actual price confidential. "
                f"The extracted shopkeeper amount is stored as [farmeramount={farmer_amount}] and the reduced amount is stored as [amount={reduced_amount}].\n\n"
                "Follow these steps for negotiation:\n\n"
                "1. **Starting Offer:**\n"
                f"   Begin by offering ₹{reduced_amount}. Say:\n"
                f"   **'Hi! I’m looking to buy this {item}. I’d like to offer ₹{reduced_amount}. Let me know your thoughts.'**\n\n"
                "2. **person's Offers:**\n"
                f"   - If the person quotes **less than or equal to ₹{farmer_amount}**, accept the offer immediately. Do not negotiate further. Confirm with:\n"
                f"     **'Great! We’ve agreed on ₹[agreed price]. We will get back to you regarding the deal and delivery details shortly.'**\n"
                f"     Then, ask:\n"
                f"     **'Just to confirm, we’ve agreed on ₹[agreed price]. This price is final and cannot be changed. Are you sure about proceeding with this price? Answer in yes/no'**\n\n"
                f"     - If the person confirms with 'yes,'yes we’ve agreed on ₹[agreed price] for item: {item} \n\n"
                f"   - If the person quotes **above ₹{farmer_amount}**, respond:\n"
                f"     **'I understand your quote, but this ₹{reduced_amount} amount is what I can offer. Let me know if you can revise your offer to fit within this range.'**\n\n"
                "3. **Incremental Counteroffers:**\n"
                f"   - If the person rejects, increase your offer incrementally in steps of ₹500 until you reach ₹{farmer_amount}. After each offer, say:\n"
                f"     **'I understand your quote, but I’d like to offer ₹[new price]. Let me know if this works for you.'**\n"
                f"   - If the person proposes a price **below your latest counteroffer but still above ₹{farmer_amount}**, repeat:\n"
                f"     **'₹{reduced_amount} is the maximum I can offer. Let me know if you can adjust your quote accordingly.'**\n\n"
                "4. **Key Rules for Consistency:**\n"
                f"   - If the person proposes a price **below or equal to ₹{reduced_amount} at any point**, accept it immediately without further counteroffers or negotiation.\n"
                f"   - Do not counter with a higher price than the person's latest offer.\n"
                f"   - Never disclose ₹{farmer_amount} as the maximum budget upfront. Reveal it only when the person quotes a price above ₹{farmer_amount}.\n"
                "   - Maintain a polite and professional tone throughout the negotiation process.\n\n"
                "5. **Final Confirmation:**\n"
                f"   Once the person agrees to a price ≤ ₹{farmer_amount}, reiterate the agreed price and confirm with:\n"
                f"   **'Just to confirm, we’ve agreed on ₹[agreed price]. This price is final, and no changes will be entertained. Are you sure you’d like to proceed?'**"
                
            )
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
    return ChatPromptTemplate(messages=messages)

@app.route("/send_msg_from_farmer", methods=["POST"])
def send_msg_from_farmer():
    farmer_msg = request.json.get("input", "")
    if not farmer_msg:
        return jsonify({"error": "No input provided for farmer message"}), 400
    global base_prompt_template
    base_prompt_template = create_base_prompt(farmer_msg)
    return jsonify({"message": "farmer's message stored and prompt updated successfully."})



@app.route("/negotiate", methods=["POST"])
def negotiate():
    input_data = request.json.get("input", "")
    person_phno = request.json.get("to", "")
    if not input_data:
        return jsonify({"error": "No input provided"}), 400
    config = {"configurable": {"session_id": person_phno}}
    if "base_prompt_template" not in globals():
        return jsonify({"error": "farmer message not set. Please set it first using /farmer"}), 400
    chain = base_prompt_template | model
    with_message_history = RunnableWithMessageHistory(chain, get_session_history)

    person_message = input_data.lower()
    ai_response = with_message_history.invoke(
        [HumanMessage(content=person_message)],
        config=config,
    )

    print(ai_response.content)
    return jsonify({"response": ai_response.content})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)



# from flask import Flask, request, jsonify
# import os
# from dotenv import load_dotenv
# from langchain_core.chat_history import BaseChatMessageHistory
# from langchain_core.runnables.history import RunnableWithMessageHistory
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
# from langchain_groq import ChatGroq
# from langchain_community.chat_message_histories import ChatMessageHistory
# import re
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)
# load_dotenv()

# # Load API key
# api_key = os.getenv("api_key")
# if not api_key:
#     raise ValueError("API key not found. Please set it in the .env file.")

# # Initialize AI model
# model = ChatGroq(model="gemma2-9b-it", groq_api_key=api_key)
# store = {}

# # Function to get chat history for a session
# def get_session_history(session_id: str) -> BaseChatMessageHistory:
#     if session_id not in store:
#         store[session_id] = ChatMessageHistory()
#     return store[session_id]

# # Function to create a negotiation prompt
# def create_base_prompt(farmer_amount=30000, item="wheat"):
#     reduced_amount = int(farmer_amount * 0.9)
    
#     messages = [
#         SystemMessage(content=f"You are an AI agent negotiating with a buyer who wants to purchase {item}. Ensure the final price does not exceed ₹{farmer_amount} but aim to secure the best deal."),
#         SystemMessage(content=(
#             "You are a negotiation AI assisting a farmer. Follow these rules:\n\n"
#             "1. Start with an offer of ₹{reduced_amount}.\n"
#             "2. If the buyer agrees to a price ≤ ₹{farmer_amount}, accept immediately.\n"
#             "3. If the buyer offers more than ₹{farmer_amount}, suggest a counteroffer within limits.\n"
#             "4. Never reveal ₹{farmer_amount} as the maximum budget upfront.\n"
#             "5. Always negotiate politely and professionally."
#         )),
#         MessagesPlaceholder(variable_name="messages"),
#     ]
#     return ChatPromptTemplate(messages=messages)

# # Store prompt template globally
# base_prompt_template = None

# @app.route("/set_farmer_price", methods=["POST"])
# def set_farmer_price():
#     global base_prompt_template
#     data = request.json
#     farmer_amount = data.get("price", 30000)
#     item = data.get("item", "wheat")
    
#     base_prompt_template = create_base_prompt(farmer_amount, item)
#     return jsonify({"message": "Farmer's price set successfully."})

# @app.route("/negotiate", methods=["POST"])
# def negotiate():
#     if base_prompt_template is None:
#         return jsonify({"error": "Farmer price not set. Please set it first using /set_farmer_price."}), 400
    
#     data = request.json
#     person_msg = data.get("input", "").strip()
#     session_id = data.get("to", "default_session")
    
#     if not person_msg:
#         return jsonify({"error": "No input provided."}), 400
    
#     config = {"configurable": {"session_id": session_id}}
#     chain = base_prompt_template | model
#     with_message_history = RunnableWithMessageHistory(chain, get_session_history)
    
#     ai_response = with_message_history.invoke(
#         [HumanMessage(content=person_msg)],
#         config=config,
#     )
    
#     return jsonify({"response": ai_response.content})

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)