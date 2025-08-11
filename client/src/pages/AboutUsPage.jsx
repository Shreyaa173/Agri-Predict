import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Target, Award, Lightbulb, Cpu, Cloud, Smartphone, Globe, BarChart3, Leaf } from 'lucide-react';

const AboutUsPage = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Accurate Predictions",
      description: "Our advanced algorithms analyze weather patterns, soil conditions, and historical data to deliver reliable forecasts tailored to your specific region and crop type."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Actionable Insights",
      description: "Get detailed insights and recommendations to optimize planting schedules, manage resources efficiently, and maximize yields for sustainable farming."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "User-Friendly Interface",
      description: "Easily navigate our platform to access forecasts, historical data, and trends with just a few clicks through our intuitive design."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Dedicated Support",
      description: "Our expert support team is always available to assist you with any questions or technical issues you may encounter."
    }
  ];

  const futureScope = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "IoT Integration",
      description: "Real-time data collection through soil sensors, weather stations, and drones for enhanced predictive accuracy.",
      details: ["Automated monitoring systems", "Continuous data updates", "Enhanced sensor networks"]
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Advanced ML Models",
      description: "Enhanced algorithms and deep learning techniques for improved prediction accuracy and trend analysis.",
      details: ["Deep learning implementation", "Anomaly detection", "Long-term trend forecasting"]
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Climate Adaptation",
      description: "Adaptive models for changing climate conditions and resilient farming practices.",
      details: ["Extreme weather handling", "Adaptive crop varieties", "Resilience planning tools"]
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precision Agriculture",
      description: "Customized recommendations for optimized planting, irrigation, and harvesting techniques.",
      details: ["Personalized advice", "Yield optimization", "Resource efficiency"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Supply Chain Integration",
      description: "Market forecasting and logistics optimization from farm to market.",
      details: ["Market demand prediction", "Pricing trends analysis", "Supply chain coordination"]
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Expansion",
      description: "Regional adaptation for diverse climates and localized farming practices worldwide.",
      details: ["Multi-region support", "Local language integration", "Cultural farming practices"]
    }
  ];

  const techStack = [
    { name: "Web Development", icon: "🌐", description: "Modern web technologies for seamless user experience" },
    { name: "Machine Learning", icon: "🤖", description: "Advanced algorithms for accurate crop predictions" },
    { name: "Data Analytics", icon: "📊", description: "Comprehensive data analysis and visualization" },
    { name: "AI Integration", icon: "🧠", description: "Artificial intelligence for smart agricultural insights" }
  ];

  return (
    <><div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-pattern opacity-30"></div>


        
        <div className="relative container mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              AgriPredict
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Your Agricultural Forecasting Partner
            </h2>
            <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
              Revolutionizing agriculture through data analytics and artificial intelligence, 
              empowering farmers with accurate crop predictions and actionable insights.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Welcome to the Future of Farming
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              In the ever-evolving world of agriculture, making informed decisions is key to a successful harvest. 
              At AgriPredict, we harness the power of cutting-edge technology and advanced analytics to provide 
              farmers and agricultural professionals with precise, data-driven crop predictions.
            </p>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 rounded-2xl shadow-lg">
              <p className="text-xl font-semibold">
                "Take the guesswork out of farming with our state-of-the-art crop prediction tools!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose AgriPredict?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-green-600 mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Technology Stack
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4 text-center">
                  {tech.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2 text-center">
                  {tech.name}
                </h4>
                <p className="text-gray-600 text-sm text-center">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Scope Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Future Scope & Innovation
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            AgriPredict is designed to evolve and adapt to meet the growing needs of modern agriculture. 
            Here's our roadmap for the future:
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {futureScope.map((scope, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="text-green-600 mr-3">
                    {scope.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {scope.title}
                  </h4>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {scope.description}
                </p>
                
                <button
                  onClick={() => toggleSection(`scope-${index}`)}
                  className="flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
                >
                  {expandedSection === `scope-${index}` ? (
                    <ChevronDown className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-1" />
                  )}
                  View Details
                </button>
                
                {expandedSection === `scope-${index}` && (
                  <div className="mt-4 pl-4 border-l-2 border-green-200">
                    <ul className="space-y-2">
                      {scope.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-gray-600 text-sm flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
    </>
  );
};

export default AboutUsPage;