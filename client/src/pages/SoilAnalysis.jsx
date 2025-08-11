import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import cropImage from "../assets/crop.png";
import bg from "../assets/home.png";

const SoilAnalysis = () => {
  const [formData, setFormData] = useState({
    Nitrogen: "",
    Phosphorus: "",
    Potassium: "",
    Temperature: "",
    Humidity: "",
    pH: "",
    Rainfall: "",
  });

  const [result, setResult] = useState("");
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState("unknown");

  // Define fields outside the handleSubmit function
  const fields = [
    { label: "Nitrogen (kg/ha)", name: "Nitrogen", min: 0, max: 300 },
    { label: "Phosphorus (kg/ha)", name: "Phosphorus", min: 0, max: 200 },
    { label: "Potassium (kg/ha)", name: "Potassium", min: 0, max: 300 },
    { label: "Temperature (°C)", name: "Temperature", min: -10, max: 50 },
    { label: "Humidity (%)", name: "Humidity", min: 0, max: 100 },
    { label: "pH (0-14)", name: "pH", min: 0, max: 14 },
    { label: "Rainfall (mm)", name: "Rainfall", min: 0, max: 3000 },
  ];

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/health");
      if (response.ok) {
        const data = await response.json();
        setServerStatus("online");
        console.log("Server status:", data);
      } else {
        setServerStatus("offline");
      }
    } catch (error) {
      setServerStatus("offline");
      console.error("Server check failed:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (const field of fields) {
      const value = parseFloat(formData[field.name]);
      if (isNaN(value)) {
        setError(`Please enter a valid number for ${field.label}`);
        return false;
      }
      if (value < field.min || value > field.max) {
        setError(`${field.label} must be between ${field.min} and ${field.max}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult("");
    setError("");
    setDebugInfo(null);

    console.log("Submitting form data:", formData);

    try {
      const apiUrl = "http://localhost:5000/api/predict";
      console.log("Making request to:", apiUrl);
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", res.status);
      
      // Check if response is HTML (server not running or wrong endpoint)
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Server returned HTML instead of JSON. Make sure the Flask server is running on port 5000.");
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Response error text:", errorText);
        throw new Error(`HTTP error! Status: ${res.status}. Response: ${errorText}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await res.text();
        console.error("Non-JSON response:", responseText);
        throw new Error(`Expected JSON response, got: ${contentType}. Response: ${responseText}`);
      }

      let data;
      try {
        data = await res.json();
        console.log("Parsed response data:", data);
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        throw new Error("Failed to parse response as JSON");
      }

      if (data.success) {
        setResult(data.result);
        if (data.debug_info) {
          setDebugInfo(data.debug_info);
          console.log("Debug info:", data.debug_info);
        }
      } else {
        setError("Error: " + (data.error || "Unknown error occurred"));
        console.error("API Error:", data.error);
        if (data.trace) {
          console.error("Error Trace:", data.trace);
        }
      }
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error message:", error.message);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError("Network error: Unable to connect to server. Please ensure the Flask server is running on http://localhost:5000");
      } else if (error.message.includes('HTML instead of JSON')) {
        setError("Server configuration error: " + error.message);
      } else if (error.message.includes('HTTP error')) {
        setError(`Server error: ${error.message}`);
      } else {
        setError(`Connection failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Test API availability
  const testAPI = async () => {
    try {
      setError("");
      const response = await fetch("http://localhost:5000/api/");
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Server returned HTML instead of JSON. The Flask server might not be running properly.");
      }
      
      const data = await response.json();
      console.log("API test successful:", data);
      alert(`API is working!\nMessage: ${data.message}\nModels loaded: ${data.model_loaded}`);
      setServerStatus("online");
    } catch (error) {
      console.error("API test failed:", error);
      setError(`API test failed: ${error.message}`);
      setServerStatus("offline");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat py-24 px-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="max-w-5xl mx-auto mt-20">
        <h1 className="text-white text-4xl md:text-5xl font-bold text-center mb-12">
          Predict Your Crop <span className="text-green-500">🌱</span>
        </h1>

        {/* Server Status Indicator */}
        {/* <div className="text-center mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            serverStatus === "online" 
              ? "bg-green-100 text-green-800" 
              : serverStatus === "offline"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              serverStatus === "online" 
                ? "bg-green-500" 
                : serverStatus === "offline"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}></div>
            Server: {serverStatus === "online" ? "Online" : serverStatus === "offline" ? "Offline" : "Checking..."}
          </div>
        </div> */}

        {/* Debug Controls
        <div className="text-center mb-4 space-x-2">
          <button
            onClick={testAPI}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Test API Connection
          </button>
          <button
            onClick={checkServerStatus}
            className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Check Server Status
          </button>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fields.map(({ label, name, min, max }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="text-white ml-2 mb-1 block text-base"
                >
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type="number"
                  step="0.01"
                  min={min}
                  max={max}
                  placeholder={`Enter ${name} (${min}-${max})`}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading || serverStatus === "offline"}
              className={`${
                loading || serverStatus === "offline"
                  ? "bg-gray-500 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700"
              } text-white text-lg px-6 py-2 rounded-full`}
            >
              {loading ? "Processing..." : serverStatus === "offline" ? "Server Offline" : "Get Recommendation"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong>Error:</strong> {error}
            {serverStatus === "offline" && (
              <div className="mt-2 text-sm">
                <strong>Troubleshooting steps:</strong>
                <ol className="list-decimal list-inside mt-1">
                  <li>Make sure Flask server is running: <code>python app.py</code></li>
                  <li>Check if server is accessible at http://localhost:5000</li>
                  <li>Ensure CORS is properly configured</li>
                  <li>Check server console for any error messages</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="mt-10 mx-auto w-full max-w-xl bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <img
              src={cropImage}
              alt="crop"
              className="h-36 w-28 object-contain mt-2"
            />
            <div className="text-center mt-4">
              <p className="text-lg font-medium text-black">{result}</p>
            </div>
          </div>
        )}

        {/* {debugInfo && (
          <div className="mt-6 bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded">
            <details>
              <summary className="cursor-pointer font-bold">Debug Information</summary>
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SoilAnalysis;