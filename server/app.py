from flask import Flask, request, jsonify, send_from_directory
import numpy as np
import pickle
import os
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__, static_folder='../client/dist', static_url_path='')
CORS(app)
app.secret_key = os.environ.get('SECRET_KEY', 'default_dev_key')

def create_scalers():
    min_max_scaler = MinMaxScaler()
    standard_scaler = StandardScaler()
    synthetic_data = np.array([
        [0, 0, 0, 0, 0, 0, 0],
        [140, 140, 140, 50, 100, 14, 300],
        [70, 70, 70, 25, 50, 7, 150],
        [20, 20, 20, 15, 30, 5, 50],
        [120, 120, 120, 35, 80, 10, 250]
    ])
    min_max_scaler.fit(synthetic_data)
    standard_scaler.fit(synthetic_data)
    return min_max_scaler, standard_scaler

def create_fallback_model():
    X_train = np.array([
    [90, 42, 43, 20, 80, 6.5, 200],  # Rice
    [60, 55, 70, 30, 75, 6.8, 180],  # Maize
    [40, 35, 20, 35, 65, 6.0, 100],  # Jute
    [80, 40, 50, 32, 60, 7.0, 160],  # Cotton
])
    y_train = np.array([1, 2, 3, 4])  # Maps to different crops
    model = RandomForestClassifier()
    model.fit(X_train, y_train)
    return model

def load_model_create_scalers():
    try:
        if os.path.exists('crop_recommendation.pkl'):
            with open('crop_recommendation.pkl', 'rb') as f:
                model = pickle.load(f)
        else:
            model = create_fallback_model()
        mx, sc = create_scalers()
        return model, sc, mx
    except Exception as e:
        print(f"Error in load_model_create_scalers: {e}")
        return None, None, None

model, sc, mx = load_model_create_scalers()

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/')
def index():
    return jsonify({"message": "Welcome to the Crop Recommendation API"})

@app.route('/api/soil-analysis')
def home():
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
def predict():
    data = request.json
    if model is None:
        return jsonify({
            "success": False,
            "error": "Model failed to load. Please check server configuration."
        }), 500
    try:
        if sc is None or mx is None:
            mx_new, sc_new = create_scalers()
        else:
            mx_new, sc_new = mx, sc
        N = float(data.get('Nitrogen', 0))
        P = float(data.get('Phosphorus', 0))
        K = float(data.get('Potassium', 0))
        temp = float(data.get('Temperature', 0))
        humidity = float(data.get('Humidity', 0))
        ph = float(data.get('pH', 0))
        rainfall = float(data.get('Rainfall', 0))
        feature_list = [N, P, K, temp, humidity, ph, rainfall]
        single_pred = np.array(feature_list).reshape(1, -1)
        sc_mx_features = sc_new.transform(single_pred)
        prediction = model.predict(sc_mx_features)
        crop_dict = {
            1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya", 7: "Orange",
            8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
            14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
            19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"
        }
        crop = crop_dict.get(prediction[0], "Unknown crop")
        result = f"{crop} is the best crop to be cultivated right there"
        return jsonify({
            "success": True,
            "prediction": int(prediction[0]),
            "crop": crop,
            "result": result
        })
    except Exception as e:
        import traceback
        return jsonify({
            "success": False,
            "error": str(e),
            "trace": traceback.format_exc()
        }), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
