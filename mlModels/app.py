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
    farmer_amount = 30000  # Minimum acceptable price
    listed_price = 35000  # Initial asking price
    item = "wheat"

    messages = [
        SystemMessage(content=f"You are an AI agent negotiating with a buyer interested in purchasing {item} from a farmer. "
                              f"Your **listed price** is ₹{listed_price}, but your **minimum acceptable price** is ₹{farmer_amount}. "
                            f"Make sure the final price does not drop below ₹{farmer_amount}. "
                            f"You must gradually reduce the price and persuade the buyer about the value of the product."),
        SystemMessage(
            content=(
                f"### **Negotiation Strategy:**  \n"
                f"- Never reveal ₹{farmer_amount} upfront. Reduce the price **gradually** (1-2%) when negotiating.  \n"
                f"- Always try to make the buyer feel like they are getting a great deal.  \n"
                f"- Accept the offer immediately if the buyer reaches ₹{farmer_amount}.  \n\n"

                f"### **Negotiation Flow:**  \n"
                f"**1. Initial Response:**  \n"
                f"- If the buyer offers below ₹{listed_price}, respond with:  \n"
                f"  **'This is high-quality {item}, and ₹{listed_price} is already a fair price. Please try to understand.'**  \n\n"

                f"**2. Gradual Reduction:**  \n"
                f"- If the buyer insists, reduce the price **gradually (1-2%)**:  \n"
                f"  - 'I understand your concern. I can offer ₹{int(listed_price * 0.98)}.'  \n"
                f"  - 'I really want to make a deal. How about ₹{int(listed_price * 0.96)}?'  \n"
                f"  - 'Alright, ₹{int(listed_price * 0.94)} is my best offer.'  \n"
                f"  - 'This is my lowest possible rate. ₹{int(listed_price * 0.92)} is a great deal for this quality.'  \n\n"

                f"- Continue **reducing the price slowly** until reaching ₹{farmer_amount}.  \n\n"

                f"**3. Accepting the Final Offer:**  \n"
                f"- If the buyer offers **₹{farmer_amount} or more**, accept immediately:  \n"
                f"  **'Okay, since you’re a serious buyer, I’ll offer ₹{farmer_amount}. But this is the absolute final price.'**  \n\n"

                f"**4. Final Confirmation:**  \n"
                f"- Once the buyer agrees, confirm the deal:  \n"
                f"  **'Just to confirm, we’ve agreed on ₹{farmer_amount}. This price is final, and no further changes will be made. "
                f"Are you sure you’d like to proceed?'**  \n\n"

                f"- If the buyer confirms, finalize the deal and store their contact details."
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