from flask import Flask, request, jsonify, send_from_directory
import numpy as np
import os
import traceback
import sys
from flask_cors import CORS
import pickle
import joblib

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)
app.secret_key = 'your_secret_key'

# Initialize global variables
dl_model = None
ml_model = None
dl_scaler = None
model_loaded = False

# Crop dictionary mapping
crop_dict = {
    1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut",
    6: "Papaya", 7: "Orange", 8: "Apple", 9: "Muskmelon", 10: "Watermelon",
    11: "Grapes", 12: "Mango", 13: "Banana", 14: "Pomegranate", 15: "Lentil",
    16: "Blackgram", 17: "Mungbean", 18: "Mothbeans", 19: "Pigeonpeas",
    20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"
}

def load_models():
    """Load ML and DL models"""
    global dl_model, ml_model, dl_scaler, model_loaded
    
    print("Loading models from:", os.getcwd())
    print("Files in current directory:", os.listdir('.'))
    
    try:
        # Try to load TensorFlow/Keras model
        try:
            import tensorflow as tf
            if os.path.exists('dl_model.h5'):
                dl_model = tf.keras.models.load_model('dl_model.h5')
                print("✓ Deep Learning model loaded successfully")
            else:
                print("⚠ dl_model.h5 not found")
        except Exception as e:
            print(f"⚠ Could not load DL model: {e}")
        
        # Try to load scaler for DL model
        try:
            if os.path.exists('dl_scaler.pkl'):
                with open('dl_scaler.pkl', 'rb') as f:
                    dl_scaler = pickle.load(f)
                print("✓ Scaler loaded successfully")
            else:
                print("⚠ dl_scaler.pkl not found")
        except Exception as e:
            print(f"⚠ Could not load scaler: {e}")
        
        # Try to load ML models (you have multiple)
        try:
            # Try different ML model files based on your directory structure
            ml_files = ['ml_model.pkl', 'ml_mx.pkl', 'ml_sc.pkl']
            for ml_file in ml_files:
                if os.path.exists(ml_file):
                    try:
                        ml_model = joblib.load(ml_file)
                        print(f"✓ Machine Learning model loaded successfully from {ml_file}")
                        
                        # Test the model with dummy data to understand its output format
                        try:
                            dummy_data = np.array([[90, 42, 43, 20.8, 82.0, 6.5, 202.9]]).reshape(1, -1)
                            dummy_prediction = ml_model.predict(dummy_data)
                            print(f"Model test prediction: {dummy_prediction}")
                            print(f"Prediction type: {type(dummy_prediction[0])}")
                            print(f"Model type: {type(ml_model)}")
                        except Exception as test_error:
                            print(f"Could not test model: {test_error}")
                        
                        break
                    except Exception as e:
                        print(f"⚠ Could not load {ml_file}: {e}")
                        continue
            else:
                print("⚠ No ML model files found")
        except Exception as e:
            print(f"⚠ Could not load ML model: {e}")
        
        # Check if at least one model is loaded
        if dl_model is not None or ml_model is not None:
            model_loaded = True
            print("✓ At least one model loaded successfully")
        else:
            print("⚠ No models could be loaded")
            # Create a dummy prediction function for testing
            print("⚠ Running in demo mode without models")
            
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        traceback.print_exc()

# Load models when the app starts
load_models()

# ===== API ROUTES =====

@app.route('/api/')
def index():
    return jsonify({
        "message": "Welcome to the Crop Recommendation API",
        "dl_model_loaded": dl_model is not None,
        "ml_model_loaded": ml_model is not None,
        "model_loaded": model_loaded,
        "tensorflow_available": 'tensorflow' in sys.modules,
        "files_in_directory": os.listdir('.'),
        "current_directory": os.getcwd()
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "dl_model_available": dl_model is not None,
        "ml_model_available": ml_model is not None,
        "model_loaded": model_loaded
    })

@app.route('/api/soil-analysis')
def home():
    return jsonify({"message": "Soil Analysis Service"})

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        return jsonify({"success": True, "message": "User registered successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        return jsonify({"success": True, "message": "Login successful"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.json
        return jsonify({"success": True, "message": "Message sent successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/resources')
def resources():
    try:
        resources_data = [
            {"title": "Crop Guide", "description": "Guide for growing various crops"},
            {"title": "Soil Health", "description": "Information about maintaining soil health"},
        ]
        return jsonify({"resources": resources_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/predict", methods=['POST'])
def predict():
    try:
        # If no models are loaded, provide a demo response
        if not model_loaded or (dl_model is None and ml_model is None):
            print("⚠ No models loaded, providing demo response")
            
            # Get the input data for demo
            data = request.json
            if not data:
                return jsonify({"success": False, "error": "No JSON data received"}), 400
            
            # Demo prediction based on simple rules
            try:
                temp = float(data.get('Temperature', 25))
                humidity = float(data.get('Humidity', 50))
                ph = float(data.get('pH', 7))
                rainfall = float(data.get('Rainfall', 100))
                
                # Simple rule-based demo prediction
                if temp > 30 and humidity > 70:
                    demo_crop = "Rice"
                elif temp < 20 and rainfall < 50:
                    demo_crop = "Apple"
                elif ph > 7.5:
                    demo_crop = "Cotton"
                elif rainfall > 200:
                    demo_crop = "Coconut"
                else:
                    demo_crop = "Maize"
                
                return jsonify({
                    "success": True,
                    "prediction": 1,
                    "crop": demo_crop,
                    "result": f"{demo_crop} is the best crop to be cultivated in this region (Demo Mode).",
                    "model_used": "Demo Mode - Simple Rules",
                    "warning": "This is a demo response. Please load proper ML models for accurate predictions."
                })
                
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": f"Demo mode error: {str(e)}"
                }), 500

        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No JSON data received"}), 400

        # Extract features from request
        required_fields = ['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH', 'Rainfall']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400

        try:
            N = float(data.get('Nitrogen', 0))
            P = float(data.get('Phosphorus', 0))
            K = float(data.get('Potassium', 0))
            temp = float(data.get('Temperature', 0))
            humidity = float(data.get('Humidity', 0))
            ph = float(data.get('pH', 0))
            rainfall = float(data.get('Rainfall', 0))
        except (ValueError, TypeError) as e:
            return jsonify({"success": False, "error": f"Invalid numeric value: {e}"}), 400

        feature_list = [N, P, K, temp, humidity, ph, rainfall]

        # Try DL model first
        if dl_model is not None and dl_scaler is not None:
            try:
                sample_scaled = dl_scaler.transform([feature_list])
                prediction_proba = dl_model.predict(sample_scaled, verbose=0)
                predicted_index = int(np.argmax(prediction_proba[0]))
                crop = crop_dict.get(predicted_index + 1, f"Unknown Crop (Label: {predicted_index + 1})")
                
                return jsonify({
                    "success": True,
                    "prediction": predicted_index + 1,
                    "crop": crop,
                    "result": f"{crop} is the best crop to be cultivated in this region.",
                    "model_used": "Deep Learning",
                    "confidence": float(np.max(prediction_proba[0])),
                    "debug_info": {
                        "input_features": feature_list,
                        "scaled_features": sample_scaled.tolist(),
                        "prediction_probabilities": prediction_proba[0].tolist(),
                        "predicted_index": predicted_index
                    }
                })
            except Exception as e:
                print(f"DL model prediction failed: {e}")
                # Fall back to ML model

        # Try ML model fallback
        if ml_model is not None:
            try:
                single_pred = np.array(feature_list).reshape(1, -1)
                prediction = ml_model.predict(single_pred)
                
                print(f"Raw ML prediction: {prediction}")
                print(f"Prediction type: {type(prediction[0])}")
                
                # Handle both string and numeric predictions
                raw_prediction = prediction[0]
                
                if isinstance(raw_prediction, str):
                    # Model returns crop name directly
                    crop = raw_prediction.title()  # Capitalize first letter
                    
                    # Try to find the corresponding numeric label (optional)
                    predicted_label = None
                    for key, value in crop_dict.items():
                        if value.lower() == raw_prediction.lower():
                            predicted_label = key
                            break
                    
                    if predicted_label is None:
                        predicted_label = "N/A"
                        
                elif isinstance(raw_prediction, (int, float, np.integer, np.floating)):
                    # Model returns numeric label
                    try:
                        predicted_label = int(raw_prediction)
                        crop = crop_dict.get(predicted_label, f"Unknown Crop (Label: {predicted_label})")
                    except (ValueError, TypeError):
                        # If conversion fails, treat as unknown
                        predicted_label = "N/A"
                        crop = f"Unknown Crop (Raw: {raw_prediction})"
                else:
                    # Unexpected prediction type
                    predicted_label = "N/A"
                    crop = f"Unknown Prediction Type: {type(raw_prediction)} - {raw_prediction}"
                
                # Get prediction probability if available
                confidence = None
                if hasattr(ml_model, 'predict_proba'):
                    try:
                        proba = ml_model.predict_proba(single_pred)
                        confidence = float(np.max(proba[0]))
                    except Exception as prob_error:
                        print(f"Could not get prediction probability: {prob_error}")
                
                result_data = {
                    "success": True,
                    "prediction": predicted_label,
                    "crop": crop,
                    "result": f"{crop} is the best crop to be cultivated in this region.",
                    "model_used": "Machine Learning",
                    "debug_info": {
                        "input_features": feature_list,
                        "raw_prediction": str(raw_prediction),
                        "prediction_type": str(type(raw_prediction)),
                        "predicted_label": predicted_label
                    }
                }
                
                if confidence is not None:
                    result_data["confidence"] = confidence
                    result_data["debug_info"]["confidence"] = confidence
                
                return jsonify(result_data)
                
            except Exception as e:
                print(f"ML model prediction failed: {e}")
                traceback.print_exc()
                return jsonify({
                    "success": False,
                    "error": f"ML model prediction failed: {str(e)}"
                }), 500

        return jsonify({"success": False, "error": "No working models available"}), 500

    except Exception as e:
        print(f"Prediction error: {e}")
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}"
        }), 500

# ===== REACT CATCH-ALL ROUTE LAST =====
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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    print(f"Starting Flask app on port {port}")
    print(f"Debug mode: {debug_mode}")
    app.run(host='0.0.0.0', port=port, debug=debug_mode)