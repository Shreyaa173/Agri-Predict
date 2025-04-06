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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    setResult(data.result);
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
            {[
              { label: "Nitrogen", name: "Nitrogen" },
              { label: "Phosphorus", name: "Phosphorus" },
              { label: "Potassium", name: "Potassium" },
              { label: "Temperature", name: "Temperature" },
              { label: "Humidity", name: "Humidity" },
              { label: "pH", name: "pH" },
              { label: "Rainfall", name: "Rainfall" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label htmlFor={name} className="text-white ml-2 mb-1 block text-base">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type="number"
                  step="0.01"
                  placeholder={`Enter ${label}`}
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
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-2 rounded-full"
            >
              Get Recommendation
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-10 mx-auto w-[28rem] bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
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