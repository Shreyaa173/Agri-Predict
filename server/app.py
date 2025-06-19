from flask import Flask, request, jsonify, send_from_directory
import numpy as np
import os
import traceback
from flask_cors import CORS
from tensorflow.keras.models import load_model
import joblib

# Load model and scaler
def load_models():
    try:
        model = load_model('model.h5')  # Load Keras model
        scaler = joblib.load('dl_standardscaler.pkl')  # Load StandardScaler
        return model, scaler
    except Exception as e:
        print(f"Error loading model or scaler: {e}")
        return None, None

model, scaler = load_models()

# Crop dictionary (index starts from 1)
crop_dict = {
    1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya", 7: "Orange",
    8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
    14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
    19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"
}

# Flask setup
app = Flask(__name__, static_folder='build')
CORS(app)
app.secret_key = 'your_secret_key'

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/')
def index():
    return jsonify({"message": "Welcome to the Crop Recommendation DL API"})

@app.route("/api/predict", methods=['POST'])
def api_predict():
    data = request.json
    if model is None or scaler is None:
        return jsonify({
            "success": False,
            "error": "Model or scaler failed to load. Please check the server setup."
        }), 500

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
        print(f"Raw Input Features: {feature_list}")

        # Scale the features using saved scaler
        sample_scaled = scaler.transform([feature_list])

        # Predict using DL model
        prediction_proba = model.predict(sample_scaled, verbose=0)
        predicted_index = int(np.argmax(prediction_proba[0]))

        crop = crop_dict.get(predicted_index + 1, f"Unknown Crop (Label: {predicted_index + 1})")
        result = f"{crop} is the best crop to be cultivated in this region."

        return jsonify({
            "success": True,
            "prediction": predicted_index + 1,
            "crop": crop,
            "result": result,
            "debug_info": {
                "probabilities": prediction_proba[0].tolist(),
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
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
