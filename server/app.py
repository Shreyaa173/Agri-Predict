from flask import Flask, request, render_template, redirect, url_for, flash, jsonify, send_from_directory
import numpy as np
import os
import traceback
import sys
from flask_cors import CORS

# Suppress TensorFlow warnings early
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

print("Starting Flask app...")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")
print(f"Files in current directory: {os.listdir('.')}")

# Initialize Flask app first
app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)
app.secret_key = 'your_secret_key'

# Global variables for models and scalers
dl_model = None
ml_model = None
dl_scaler = None
ml_sc = None
ml_mx = None
model_loaded = False

# Crop dictionary (index starts from 1)
crop_dict = {
    1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya", 7: "Orange",
    8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
    14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
    19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"
}

def load_models():
    global dl_model, ml_model, dl_scaler, ml_sc, ml_mx, model_loaded
    
    # Try to load Deep Learning model first
    try:
        print("Attempting to import TensorFlow...")
        from tensorflow.keras.models import load_model
        import joblib
        print("TensorFlow imported successfully")
        
        print("Checking for model files...")
        dl_model_path = 'dl_model.h5'
        dl_scaler_path = 'dl_scaler.pkl'
        
        if os.path.exists(dl_model_path) and os.path.exists(dl_scaler_path):
            print(f"Loading DL model from {dl_model_path}...")
            dl_model = load_model(dl_model_path)
            print("DL Model loaded successfully")
            
            print(f"Loading DL scaler from {dl_scaler_path}...")
            dl_scaler = joblib.load(dl_scaler_path)
            print("DL Scaler loaded successfully")
        else:
            print("DL model files not found, trying ML model...")
            
    except Exception as e:
        print(f"Error loading DL model: {e}")
        dl_model = None
        dl_scaler = None
    
    # Try to load ML model as fallback
    try:
        import joblib
        print("Attempting to load ML model...")
        
        ml_model_path = 'ml_model.pkl'
        ml_sc_path = 'ml_sc.pkl'
        ml_mx_path = 'ml_sc.pkl'
        
        if os.path.exists(ml_model_path):
            print(f"Loading ML model from {ml_model_path}...")
            ml_model = joblib.load(ml_model_path)
            print("ML Model loaded successfully")
            
            if os.path.exists(ml_sc_path):
                ml_sc = joblib.load(ml_sc_path)
                print("ML StandardScaler loaded successfully")
                
            if os.path.exists(ml_mx_path):
                ml_mx = joblib.load(ml_mx_path)
                print("ML MinMaxScaler loaded successfully")
                
    except Exception as e:
        print(f"Error loading ML model: {e}")
        ml_model = None
        ml_sc = None
        ml_mx = None
    
    # Check if at least one model is loaded
    if dl_model is not None or ml_model is not None:
        model_loaded = True
        print("At least one model loaded successfully")
        return True
    else:
        print("No models could be loaded!")
        return False

# React app serving routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    try:
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        return f"Error serving file: {str(e)}", 500

# Handle React routing
@app.errorhandler(404) 
def not_found(e):
    try:
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as ex:
        return f"404 handler error: {str(ex)}", 500

# API Routes
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
        # Add your signup logic here
        return jsonify({"success": True, "message": "User registered successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        # Add your login logic here
        return jsonify({"success": True, "message": "Login successful"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.json
        # Add your contact form logic here
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
        print(f"Received prediction request. Model loaded: {model_loaded}")
        
        # Check if any model is loaded
        if not model_loaded or (dl_model is None and ml_model is None):
            return jsonify({
                "success": False,
                "error": "No models available. Please check server configuration.",
                "debug": {
                    "dl_model_loaded": dl_model is not None,
                    "ml_model_loaded": ml_model is not None,
                    "files_in_directory": os.listdir('.')
                }
            }), 500

        # Get and validate input data
        data = request.json
        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data received"
            }), 400

        print(f"Received data: {data}")

        # Extract features from input data
        try:
            N = float(data.get('Nitrogen', 0))
            P = float(data.get('Phosphorus', 0))
            K = float(data.get('Potassium', 0))
            temp = float(data.get('Temperature', 0))
            humidity = float(data.get('Humidity', 0))
            ph = float(data.get('pH', 0))
            rainfall = float(data.get('Rainfall', 0))
        except (ValueError, TypeError) as e:
            return jsonify({
                "success": False,
                "error": f"Invalid input data: {str(e)}"
            }), 400

        feature_list = [N, P, K, temp, humidity, ph, rainfall]
        print(f"Processed features: {feature_list}")

        # Try Deep Learning model first
        if dl_model is not None and dl_scaler is not None:
            try:
                print("Using Deep Learning model...")
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
                    "debug_info": {
                        "probabilities": prediction_proba[0].tolist(),
                        "features": feature_list,
                        "scaled_features": sample_scaled[0].tolist()
                    }
                })
            except Exception as e:
                print(f"DL model prediction failed: {e}")
                # Fall through to ML model
        
        # Use ML model as fallback  
        if ml_model is not None:
            try:
                print("Using Machine Learning model...")
                single_pred = np.array(feature_list).reshape(1, -1)
                
                # Apply preprocessing if scalers are available
                if ml_mx is not None and ml_sc is not None:
                    mx_features = ml_mx.transform(single_pred)
                    sc_mx_features = ml_sc.transform(mx_features)
                    prediction = ml_model.predict(sc_mx_features)
                else:
                    prediction = ml_model.predict(single_pred)
                
                # Handle different prediction formats
                if isinstance(prediction, (np.ndarray, list, tuple)):
                    if isinstance(prediction[0], str):
                        crop = prediction[0].strip().lower()
                        crop_to_label = {v.lower(): k for k, v in crop_dict.items()}
                        predicted_label = crop_to_label.get(crop, -1)
                        crop = crop_dict.get(predicted_label, crop.capitalize())
                    else:
                        predicted_label = int(prediction[0])
                        crop = crop_dict.get(predicted_label, f"Unknown Crop (Label: {predicted_label})")
                else:
                    predicted_label = int(prediction)
                    crop = crop_dict.get(predicted_label, f"Unknown Crop (Label: {predicted_label})")

                return jsonify({
                    "success": True,
                    "prediction": predicted_label if 'predicted_label' in locals() else -1,
                    "crop": crop,
                    "result": f"{crop} is the best crop to be cultivated in this region.",
                    "model_used": "Machine Learning",
                    "debug_info": {
                        "raw_prediction": prediction.tolist() if hasattr(prediction, 'tolist') else str(prediction),
                        "features": feature_list
                    }
                })
            except Exception as e:
                print(f"ML model prediction failed: {e}")
                return jsonify({
                    "success": False,
                    "error": f"Both models failed. Last error: {str(e)}"
                }), 500
        
        return jsonify({
            "success": False,
            "error": "No working models available"
        }), 500

    except Exception as e:
        print(f"Unexpected error in predict: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}",
            "trace": traceback.format_exc()
        }), 500

# Load models when the app starts
print("Loading models...")
model_load_success = load_models()
print(f"Model loading {'successful' if model_load_success else 'failed'}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)