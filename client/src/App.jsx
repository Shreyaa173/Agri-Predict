import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUsPage from "./pages/AboutUsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SoilAnalysis from "./pages/SoilAnalysis";
import ContactPage from "./pages/Contact";
import ResourcesPage from "./pages/Resources";

const App = () => {
  return (
    <div className="app-container">
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/soil-analysis" element={<SoilAnalysis />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/about" element={<AboutUsPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
