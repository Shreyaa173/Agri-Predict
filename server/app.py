from flask import Flask, request, jsonify, send_from_directory
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

# Global variables for model and scaler
model = None
scaler = None
model_loaded = False

# Load TensorFlow after Flask setup
def load_models():
    global model, scaler, model_loaded
    try:
        print("Attempting to import TensorFlow...")
        from tensorflow.keras.models import load_model
        import joblib
        print("TensorFlow imported successfully")
        
        print("Checking for model files...")
        model_path = 'model.h5'
        scaler_path = 'dl_standardscaler.pkl'
        
        if not os.path.exists(model_path):
            print(f"ERROR: Model file {model_path} not found!")
            print(f"Files in directory: {os.listdir('.')}")
            return False
            
        if not os.path.exists(scaler_path):
            print(f"ERROR: Scaler file {scaler_path} not found!")
            print(f"Files in directory: {os.listdir('.')}")
            return False
        
        print(f"Loading model from {model_path}...")
        model = load_model(model_path)
        print("Model loaded successfully")
        
        print(f"Loading scaler from {scaler_path}...")
        scaler = joblib.load(scaler_path)
        print("Scaler loaded successfully")
        
        model_loaded = True
        return True
        
    except ImportError as e:
        print(f"Import error: {e}")
        return False
    except Exception as e:
        print(f"Error loading model or scaler: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return False

# Crop dictionary (index starts from 1)
crop_dict = {
    1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya", 7: "Orange",
    8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
    14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
    19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"
}

@app.route('/')
def serve_react_app():
    try:
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        return f"Error serving React app: {str(e)}", 500

@app.route('/<path:path>')
def serve_static_files(path):
    try:
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        return f"Error serving static file: {str(e)}", 500

@app.errorhandler(404)
def not_found(e):
    try:
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as ex:
        return f"404 handler error: {str(ex)}", 500

@app.route('/api/')
def index():
    return jsonify({
        "message": "Welcome to the Crop Recommendation DL API",
        "model_loaded": model_loaded,
        "tensorflow_available": 'tensorflow' in sys.modules,
        "files_in_directory": os.listdir('.'),
        "current_directory": os.getcwd()
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model_loaded,
        "model_available": model is not None,
        "scaler_available": scaler is not None
    })

@app.route("/api/predict", methods=['POST'])
def api_predict():
    try:
        print(f"Received prediction request. Model loaded: {model_loaded}")
        
        # Check if models are loaded
        if not model_loaded or model is None or scaler is None:
            error_msg = "Model or scaler not loaded. "
            if not model_loaded:
                error_msg += "Models failed to load during startup. "
            if model is None:
                error_msg += "Model is None. "
            if scaler is None:
                error_msg += "Scaler is None. "
            
            return jsonify({
                "success": False,
                "error": error_msg,
                "debug": {
                    "model_loaded": model_loaded,
                    "model_exists": model is not None,
                    "scaler_exists": scaler is not None,
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

        # Scale the features using saved scaler
        try:
            sample_scaled = scaler.transform([feature_list])
            print(f"Scaled features: {sample_scaled}")
        except Exception as e:
            return jsonify({
                "success": False,
                "error": f"Error scaling features: {str(e)}"
            }), 500

        # Predict using DL model
        try:
            prediction_proba = model.predict(sample_scaled, verbose=0)
            predicted_index = int(np.argmax(prediction_proba[0]))
            print(f"Prediction probabilities: {prediction_proba[0]}")
            print(f"Predicted index: {predicted_index}")
        except Exception as e:
            return jsonify({
                "success": False,
                "error": f"Error during prediction: {str(e)}"
            }), 500

        crop = crop_dict.get(predicted_index + 1, f"Unknown Crop (Label: {predicted_index + 1})")
        result = f"{crop} is the best crop to be cultivated in this region."

        return jsonify({
            "success": True,
            "prediction": predicted_index + 1,
            "crop": crop,
            "result": result,
            "debug_info": {
                "probabilities": prediction_proba[0].tolist(),
                "features": feature_list,
                "scaled_features": sample_scaled[0].tolist()
            }
        })

    except Exception as e:
        print(f"Unexpected error in api_predict: {str(e)}")
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
    print(f"Starting Flask app on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)