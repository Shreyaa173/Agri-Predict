import React, { useState } from "react";
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

  // ✅ Define fields outside the handleSubmit function
  const fields = [
    { label: "Nitrogen (kg/ha)", name: "Nitrogen" },
    { label: "Phosphorus (kg/ha)", name: "Phosphorus" },
    { label: "Potassium (kg/ha)", name: "Potassium" },
    { label: "Temperature (°C)", name: "Temperature" },
    { label: "Humidity (%)", name: "Humidity" },
    { label: "pH (0-14)", name: "pH" },
    { label: "Rainfall (mm)", name: "Rainfall" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setError("");
    setDebugInfo(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        throw new Error("Failed to parse response as JSON");
      }

      if (data.success) {
        setResult(data.result);
        if (data.debug_info) {
          setDebugInfo(data.debug_info);
          console.log("Debug info:", data.debug_info);
        }
      } else {
        setError("Error: " + data.error);
        console.error("Error Trace:", data.trace);
      }
    } catch (error) {
      setError("Failed to connect to server.");
      console.error("Network error:", error);
    } finally {
      setLoading(false);
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fields.map(({ label, name }) => (
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
                  placeholder={`Enter ${name}`}
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
              disabled={loading}
              className={`${
                loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
              } text-white text-lg px-6 py-2 rounded-full`}
            >
              {loading ? "Processing..." : "Get Recommendation"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
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
      </div>
    </div>
  );
};

export default SoilAnalysis;
