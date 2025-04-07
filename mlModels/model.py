import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import os

file_path = "10yr_monthly_profit_data.csv"

scaler = MinMaxScaler(feature_range=(0, 1))

def load_and_preprocess_data():
    df = pd.read_csv(file_path)
    df['Month'] = pd.to_datetime(df['Month'], format='%b-%Y')
    df = df.sort_values('Month')

    data = df['Profit (₹)'].values.reshape(-1, 1)
    scaled_data = scaler.fit_transform(data)

    X, y = [], []
    window_size = 6  # using last 6 months to predict next

    for i in range(window_size, len(scaled_data)):
        X.append(scaled_data[i-window_size:i])
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

    model.save("profit_model.h5")
    print("✅ Model trained and saved as 'profit_model.h5'")

def predict_future():
    _, _, scaled_data = load_and_preprocess_data()

    model = load_model("profit_model.h5")
    last_window = scaled_data[-6:].reshape(1, 6, 1)

    future_predictions = []
    for _ in range(6):
        next_pred = model.predict(last_window)[0]
        future_predictions.append(next_pred[0])

        last_window = np.append(last_window[:, 1:, :], [[[next_pred[0]]]], axis=1)

    # Inverse transform to get ₹ values
    future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1)).flatten()

    return [round(float(p), 2) for p in future_predictions]
