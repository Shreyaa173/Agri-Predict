from flask import Flask, request, render_template, redirect, url_for, flash, jsonify, send_from_directory
import numpy as np
import sklearn
import os
import traceback
from flask_cors import CORS
import joblib

# Function to load model and scalers
def load_models():
    try:
        model = joblib.load('model.pkl') 
        sc = joblib.load('standardscaler.pkl') 
        mx = joblib.load('minmaxscaler.pkl')  
        return model, sc, mx

    except Exception as e:
        print(f"Error loading model or scalers: {e}")
        return None, None, None

# Initialize Flask app
app = Flask(__name__, static_folder='build')
app.secret_key = 'your_secret_key'
CORS(app)

# Load models, scalers
model, sc, mx = load_models()

@app.route('/api/')
def api_index():
    return jsonify({"message": "Welcome to the Crop Recommendation API"})

@app.route('/api/soil-analysis')
def api_home():
    return jsonify({"message": "Soil Analysis Service"})

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    return jsonify({"success": True, "message": "User registered successfully"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    return jsonify({"success": True, "message": "Login successful"})

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    return jsonify({"success": True, "message": "Message sent successfully"})

@app.route('/api/resources')
def resources():
    resources_data = [
        {"title": "Crop Guide", "description": "Guide for growing various crops"},
        {"title": "Soil Health", "description": "Information about maintaining soil health"}
    ]
    return jsonify({"resources": resources_data})

@app.route("/api/predict", methods=['POST'])
def api_predict():
    data = request.json
    if model is None:
        return jsonify({
            "success": False,
            "error": "Model failed to load. Please check server configuration."
        }), 500

    crop_dict = {
        1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya", 7: "Orange",
        8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
        14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
        19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"
    }

    try:
        # Extract features from input data
        N = float(data.get('Nitrogen', 0))
        P = float(data.get('Phosphorus', 0))
        K = float(data.get('Potassium', 0))
        temp = float(data.get('Temperature', 0))
        humidity = float(data.get('Humidity', 0))
        ph = float(data.get('pH', 0))
        rainfall = float(data.get('Rainfall', 0))

        feature_list = [N, P, K, temp, humidity, ph, rainfall]
        print(f"Raw Input Features: {feature_list}")  # Debug log

        # Test without preprocessing
        single_pred = np.array(feature_list).reshape(1, -1)
        prediction = model.predict(single_pred)
        print(f"Prediction Without Preprocessing: {prediction}")  # Debug log

        # Uncomment this block if preprocessing is required
        # mx_features = mx.transform(single_pred)
        # sc_mx_features = sc.transform(mx_features)
        # prediction = model.predict(sc_mx_features)
        # print(f"Prediction With Preprocessing: {prediction}")  # Debug log

        # Handle the case when the prediction is already a string (crop name)
        if isinstance(prediction, (np.ndarray, list, tuple)):
            if isinstance(prediction[0], str):  # If model returns string label like 'jute'
                crop = prediction[0].strip().lower()  # Normalize case and strip whitespace
                crop_to_label = {v.lower(): k for k, v in crop_dict.items()}  # Case-insensitive mapping
                predicted_label = crop_to_label.get(crop, -1)
                crop = crop_dict.get(predicted_label, crop.capitalize())  # Ensure crop name is consistent
            else:  # If model returns numeric label
                predicted_label = int(prediction[0])
                crop = crop_dict.get(predicted_label, f"Unknown Crop (Label: {predicted_label})")
        else:
            # fallback in case it's scalar
            try:
                predicted_label = int(prediction)
                crop = crop_dict.get(predicted_label, f"Unknown Crop (Label: {predicted_label})")
            except:
                crop = str(prediction)
                predicted_label = -1

        print(f"Final Crop: {crop}, Label: {predicted_label}")  # Debug log

        result = f"{crop} is the best crop to be cultivated in this region."

        # Return the prediction result with detailed information for debugging
        return jsonify({
            "success": True,
            "prediction": predicted_label,
            "crop": crop,
            "result": result,
            "debug_info": {
                "raw_prediction": prediction.tolist() if hasattr(prediction, 'tolist') else str(prediction),
                "features": feature_list
            }
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "trace": traceback.format_exc()
        }), 400
    
    if __name__ == '__main__':
        port = int(os.environ.get("PORT", 3000))
        app.run(host='0.0.0.0', port=port)