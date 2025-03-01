from pymongo import MongoClient
import os 
mongo_uri = "mongodb+srv://pratikpatil9113:Patya%406878@cluster0.xsfvy.mongodb.net/test?retryWrites=true&w=majority"

try:
    client = MongoClient(mongo_uri)
    db = client["test"]  # Ensure you are using the correct database
    print("✅ Connected to MongoDB! Collections:", db.list_collection_names())
except Exception as e:
    print("❌ MongoDB Connection Error:", str(e))
    db = None  # Set db to None if connection fails
