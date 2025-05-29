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
import requests
import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime
import csv
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

app = Flask(__name__)
CORS(app)  
load_dotenv()  

api_key = os.getenv("digikissan")
if not api_key:
    raise ValueError("API key not found. Please set it in the .env file.")

model = ChatGroq(model="gemma2-9b-it", groq_api_key=api_key)

store = {}



GROQ_API_KEY = os.getenv("digikissan")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

def ask_groq(prompt, model="llama3-8b-8192"):
    import requests

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    try:
        res = requests.post(GROQ_URL, headers=headers, json=payload)
        res.raise_for_status()  # Raises HTTPError for bad responses (4xx/5xx)
        data = res.json()

        print("[DEBUG] Groq raw response:", data)  # Optional: log for debugging

        # Check if 'choices' exists and has content
        if "choices" in data and len(data["choices"]) > 0:
            return data["choices"][0]["message"]["content"]
        else:
            raise ValueError("No 'choices' found in Groq API response")

    except requests.exceptions.RequestException as e:
        print("[ERROR] Request failed:", e)
        return "Sorry, something went wrong while contacting the AI service."

    except Exception as e:
        print("[ERROR] Unexpected error:", e)
        return "Sorry, I couldn't process your request at the moment."



schemes_collection = db["schemes"]







file_path = "10yr_monthly_profit_data.csv"
model_path = "profit_model.h5"
scaler = MinMaxScaler(feature_range=(0, 1))

def load_and_preprocess_data():
    df = pd.read_csv(file_path)
    df['Month'] = pd.to_datetime(df['Month'], format='%b-%Y')
    df = df.sort_values('Month')

    data = df['Profit (₹)'].values.reshape(-1, 1)
    scaled_data = scaler.fit_transform(data)

    X, y = [], []
    window_size = 6

    for i in range(window_size, len(scaled_data)):
        X.append(scaled_data[i - window_size:i])
        y.append(scaled_data[i])

    return np.array(X), np.array(y), scaled_data

def train_model():
    X, y, _ = load_and_preprocess_data()
    model = Sequential([
        LSTM(50, activation='relu', return_sequences=False, input_shape=(X.shape[1], 1)),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    model.fit(X, y, epochs=100, batch_size=16, verbose=0)
    model.save(model_path)
    print("✅ Model trained and saved as 'profit_model.h5'")

def predict_future():
    _, _, scaled_data = load_and_preprocess_data()

    if not os.path.exists(model_path):
        train_model()

    model = load_model(model_path)
    last_window = scaled_data[-6:].reshape(1, 6, 1)

    future_predictions = []
    for _ in range(6):
        next_pred = model.predict(last_window, verbose=0)[0]
        future_predictions.append(next_pred[0])
        last_window = np.append(last_window[:, 1:, :], [[[next_pred[0]]]], axis=1)

    future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1)).flatten()
    return [round(float(p), 2) for p in future_predictions]

@app.route('/predict', methods=['GET'])
def predict():
    predictions = predict_future()
    return jsonify({
        "message": "📈 Future Profit Predictions",
        "predicted_profits": predictions
    })


CSV_FILE = '10yr_monthly_profit_data.csv'

@app.route('/update-csv', methods=['POST'])
def update_csv():
    data = request.get_json()
    profit = data.get('profit')
    

    if profit is None:
        return jsonify({"error": "Profit not provided"}), 400

    now = datetime.now()
    current_month = now.strftime('%b-%Y')  # e.g., Apr-2025

    existing_rows = []
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode='r') as file:
            reader = csv.reader(file)
            existing_rows = list(reader)

    updated = False
    for i, row in enumerate(existing_rows):
        if row and row[0] == current_month:
            existing_rows[i][1] = str(profit)  # Update existing month's profit
            updated = True
            break

    if not updated:
        existing_rows.append([current_month, profit])  # Add new month

    with open(CSV_FILE, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(existing_rows)

    return jsonify({"message": f"CSV updated for {current_month} with profit {profit}"}), 200





# Global variables to reuse across functions
model = None
le = None

def train_crop_model():
    global model, le
    # Load dataset
    df = pd.read_csv("Crop_recommendation.csv")

    # Split features and target
    X = df.drop("label", axis=1)
    y = df["label"]

    # Encode labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    # Train Random Forest model
    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    # Accuracy logging
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✅ Model trained. Accuracy: {accuracy:.2f}")
    return model, le

def predict_crop_from_input(input_data):
    """
    input_data: dict with keys N, P, K, temperature, humidity, ph, rainfall
    """
    global model, le
    if model is None or le is None:
        train_crop_model()

    # Convert input dict to feature array
    feature_array = np.array([[input_data["N"], input_data["P"], input_data["K"],
                               input_data["temperature"], input_data["humidity"],
                               input_data["ph"], input_data["rainfall"]]])
    
    prediction = model.predict(feature_array)
    predicted_crop = le.inverse_transform(prediction)[0]
    return predicted_crop


@app.route('/predict-crop', methods=['POST'])
def predict_crop():
    try:
        data = request.get_json()
        predicted_crop = predict_crop_from_input(data)
        return jsonify({
            "message": "🌾 Crop Recommendation",
            "suggested_crop": predicted_crop
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500






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