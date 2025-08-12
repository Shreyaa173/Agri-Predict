import React, { useState, useEffect, useRef } from 'react';

const ResourcesPage = () => {
  // State variables
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState(8);
  const cardsPerLoad = 4;
  const categoryDropdownRef = useRef(null);

  // Placeholder images for demo - replace with actual asset paths
  const resourceImage = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop";
  const saplingImage = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop";
  const boyImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

  // Updated resource data with real-time 2024-2025 agricultural resources
  const resourceCards = [
    {
      id: 1,
      type: "guide",
      category: "precision",
      title: "2025 Farm Custom Work Rates Guide",
      description: "Michigan State University's comprehensive guide to custom farming rates and precision agriculture integration for optimal cost efficiency.",
      author: "MSU Extension Team",
      date: "2024-12-10",
      popularity: 98,
      action: "Free Download",
      icon: "download"
    },
    {
      id: 2,
      type: "toolkit",
      category: "precision",
      title: "AI-Powered Crop Monitoring Platform",
      description: "Real-time satellite imagery and machine learning analytics for precision agriculture and data-driven farming decisions.",
      author: "Farmonaut Technologies",
      date: "2025-01-15",
      popularity: 96,
      action: "Access Tool",
      icon: "download"
    },
    {
      id: 3,
      type: "guide",
      category: "finance",
      title: "2025 Farm Bill Reauthorization Primer",
      description: "Complete guide to upcoming Farm Bill changes, USDA programs, and infrastructure investments for rural communities.",
      author: "National Association of Counties",
      date: "2025-02-20",
      popularity: 94,
      action: "Free Download",
      icon: "file-pdf"
    },
    {
      id: 4,
      type: "webinar",
      category: "technology",
      title: "Precision Agriculture Trends 2025",
      description: "Expert insights on GPS guidance, IoT sensors, drones, and blockchain traceability transforming modern farming.",
      author: "StartUs Insights",
      date: "2024-08-27",
      popularity: 92,
      action: "Watch Now",
      icon: "play-circle"
    },
    {
      id: 5,
      type: "guide",
      category: "finance",
      title: "Farmer's Tax Guide 2024",
      description: "IRS Publication 225 with updated tax regulations, deductions, and cash method accounting for agricultural operations.",
      author: "Internal Revenue Service",
      date: "2024-11-30",
      popularity: 89,
      action: "Free Download",
      icon: "download"
    },
    {
      id: 6,
      type: "case study",
      category: "sustainability",
      title: "Vertical Farming Climate Solutions",
      description: "How vertical farming enables climate-smart agriculture, local sourcing, and reduced environmental impact in 2025.",
      author: "AgTech Innovation Lab",
      date: "2025-01-20",
      popularity: 91,
      action: "Read Case Study",
      icon: "file-alt"
    },
    {
      id: 7,
      type: "toolkit",
      category: "technology",
      title: "GPS-Guided Machinery Calculator",
      description: "Interactive tool to calculate ROI and efficiency gains from GPS guidance systems and automated farming equipment.",
      author: "Precision Farming Dealer",
      date: "2025-03-07",
      popularity: 87,
      action: "Use Calculator",
      icon: "download"
    },
    {
      id: 8,
      type: "guide",
      category: "market",
      title: "State of U.S. Agriculture 2024",
      description: "Comprehensive analysis of family farm statistics, income trends, and key findings shaping agriculture's future.",
      author: "Illinois Extension UIUC",
      date: "2025-01-10",
      popularity: 93,
      action: "Free Download",
      icon: "file-pdf"
    },
    {
      id: 9,
      type: "guide",
      category: "finance",
      title: "Beginning Farmer Resources 2025",
      description: "USDA's complete guide for new farmers including loans, grants, technical assistance, and startup support programs.",
      author: "USDA Farmers.gov",
      date: "2024-01-31",
      popularity: 95,
      action: "Explore Resources",
      icon: "download"
    },
    {
      id: 10,
      type: "webinar",
      category: "technology",
      title: "AI in Modern Agriculture 2025",
      description: "How artificial intelligence and machine learning are transforming crop monitoring, pest management, and yield optimization.",
      author: "Agricultural AI Consortium",
      date: "2025-02-15",
      popularity: 90,
      action: "Watch Now",
      icon: "play-circle"
    },
    {
      id: 11,
      type: "toolkit",
      category: "disaster",
      title: "Agricultural Disaster Recovery Kit",
      description: "Comprehensive collection of USDA disaster assistance programs, grants, loans, and technical support resources.",
      author: "Iowa Department of Agriculture",
      date: "2025-01-22",
      popularity: 88,
      action: "Access Tools",
      icon: "download"
    },
    {
      id: 12,
      type: "guide",
      category: "sustainability",
      title: "Top Agriculture Challenges 2024",
      description: "Analysis of resource depletion, urbanization, and sustainable solutions to boost agricultural efficiency and productivity.",
      author: "Verdesian Life Sciences",
      date: "2024-09-04",
      popularity: 86,
      action: "Read Guide",
      icon: "download"
    },
    {
      id: 13,
      type: "toolkit",
      category: "precision",
      title: "Remote Sensing Data Analytics",
      description: "Advanced satellite imagery analysis tools for crop health monitoring, field variability assessment, and yield prediction.",
      author: "Precision Agriculture Tech",
      date: "2025-04-12",
      popularity: 94,
      action: "Try Platform",
      icon: "download"
    },
    {
      id: 14,
      type: "case study",
      category: "technology",
      title: "IoT Sensors Farm Implementation",
      description: "Real-world deployment of Internet of Things sensors for soil monitoring, weather tracking, and automated irrigation systems.",
      author: "Smart Farm Solutions",
      date: "2024-11-18",
      popularity: 85,
      action: "View Case Study",
      icon: "file-alt"
    },
    {
      id: 15,
      type: "webinar",
      category: "market",
      title: "Blockchain in Agriculture Supply Chain",
      description: "How blockchain technology enables traceability, transparency, and quality assurance from farm to consumer.",
      author: "AgriBlockchain Alliance",
      date: "2025-01-05",
      popularity: 83,
      action: "Watch Webinar",
      icon: "play-circle"
    },
    {
      id: 16,
      type: "guide",
      category: "soil",
      title: "Soil Health Assessment Guide 2025",
      description: "Advanced techniques for measuring soil biological activity, carbon content, and nutrient availability using modern testing methods.",
      author: "Soil Science Society",
      date: "2024-10-15",
      popularity: 91,
      action: "Free Download",
      icon: "download"
    },
    {
      id: 17,
      type: "toolkit",
      category: "weather",
      title: "Climate Risk Management Tools",
      description: "Predictive analytics platform for weather pattern analysis, drought forecasting, and climate adaptation planning.",
      author: "NOAA Climate Services",
      date: "2025-03-01",
      popularity: 89,
      action: "Access Tools",
      icon: "download"
    },
    {
      id: 18,
      type: "case study",
      category: "precision",
      title: "Variable Rate Application Success",
      description: "How precision application of fertilizers and pesticides increased yields by 28% while reducing input costs by 15%.",
      author: "Precision Ag Research",
      date: "2024-12-05",
      popularity: 92,
      action: "Read Case Study",
      icon: "file-alt"
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter resources based on current filter and category
  const filteredResources = resourceCards.filter(card => {
    return (currentFilter === 'all' || card.type === currentFilter) && 
           (currentCategory === 'all' || card.category === currentCategory);
  });

  // Get color based on retention value
  const getColor = (value) => {
    const intensity = Math.floor((value / 100) * 255);
    return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
  };

  // Filter button click handler
  const handleFilterClick = (filter) => {
    setCurrentFilter(filter);
    setVisibleCards(8); // Reset visible cards count
  };

  // Category option click handler
  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    setCategoryDropdownOpen(false);
    setVisibleCards(8); // Reset visible cards count
  };

  // Load more button click handler
  const handleLoadMore = () => {
    setVisibleCards(prev => prev + cardsPerLoad);
  };

  // Get the appropriate icon component based on the name
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'download':
        return <i className="fas fa-download"></i>;
      case 'play-circle':
        return <i className="fas fa-play-circle"></i>;
      case 'file-alt':
        return <i className="fas fa-file-alt"></i>;
      case 'file-pdf':
        return <i className="fas fa-file-pdf"></i>;
      default:
        return <i className="fas fa-file"></i>;
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-900">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-black opacity-50 z-0 bg">
        <img
          src={resourceImage}
          alt="Background"
          className="w-full h-full object-cover filter blur-[7px]"
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="backdrop-blur-md bg-black/30 rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white">Resources</h1>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0 overflow-x-auto">
              <button 
                className={`px-4 py-2 rounded-md bg-[#151F14] hover:bg-opacity-80 text-white ${currentFilter === 'all' ? 'bg-[#4caf50]' : ''}`}
                onClick={() => handleFilterClick('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded-md bg-[#151F14] hover:bg-opacity-80 text-white ${currentFilter === 'guide' ? 'bg-[#4caf50]' : ''}`}
                onClick={() => handleFilterClick('guide')}
              >
                Guides
              </button>
              <button 
                className={`px-4 py-2 rounded-md bg-[#151F14] hover:bg-opacity-80 text-white ${currentFilter === 'case study' ? 'bg-[#4caf50]' : ''}`}
                onClick={() => handleFilterClick('case study')}
              >
                Case Studies
              </button>
              <button 
                className={`px-4 py-2 rounded-md bg-[#151F14] hover:bg-opacity-80 text-white ${currentFilter === 'webinar' ? 'bg-[#4caf50]' : ''}`}
                onClick={() => handleFilterClick('webinar')}
              >
                Webinars
              </button>
              <button 
                className={`px-4 py-2 rounded-md bg-[#151F14] hover:bg-opacity-80 text-white ${currentFilter === 'toolkit' ? 'bg-[#4caf50]' : ''}`}
                onClick={() => handleFilterClick('toolkit')}
              >
                Tools
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                className="bg-[#151F14] flex items-center space-x-1 hover:bg-opacity-80 text-white px-4 py-2 rounded-md"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                <span>{currentCategory === 'all' ? 'All Categories' : 
                       currentCategory === 'crop' ? 'Crop Management' :
                       currentCategory === 'soil' ? 'Soil Health' :
                       currentCategory === 'weather' ? 'Weather' :
                       currentCategory === 'market' ? 'Market Analysis' :
                       currentCategory === 'sustainability' ? 'Sustainability' :
                       currentCategory === 'precision' ? 'Precision Agriculture' :
                       currentCategory === 'technology' ? 'AgTech & Innovation' :
                       currentCategory === 'finance' ? 'Finance & Policy' :
                       'Disaster Recovery'}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {categoryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#151F14] rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    <li>
                      <button onClick={() => handleCategoryClick('all')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4caf50]">
                        All Categories
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategoryClick('precision')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4caf50]">
                        Precision Agriculture
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategoryClick('technology')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4caf50]">
                        AgTech & Innovation
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategoryClick('finance')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4caf50]">
                        Finance & Policy
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategoryClick('sustainability')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4caf50]">
                        Sustainability
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategoryClick('market')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4caf50]">
                        Market Analysis
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategoryClick('soil')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4caf50]">
                        Soil Health
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategoryClick('weather')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4caf50]">
                        Weather
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleCategoryClick('disaster')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#4caf50]">
                        Disaster Recovery
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Resource Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.slice(0, visibleCards).map((card, index) => (
                <div
                  key={card.id}
                  className="bg-[#151F14] rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 shadow-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img
                      src={saplingImage}
                      alt={card.title}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-[#4caf50] text-white text-xs px-2 py-1 rounded">
                      {card.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-white line-clamp-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                      {card.description}
                    </p>
                    <div className="flex items-center mb-3">
                      <img
                        src={boyImage}
                        alt={card.author}
                        className="w-8 h-8 rounded-full border-2 border-[#4caf50]"
                      />
                      <span className="ml-2 text-sm text-white">{card.author}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-300">
                      <button className="flex items-center space-x-1 hover:text-[#4caf50] transition">
                        {getIcon(card.icon)}
                        <span className="ml-2">{card.action}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-[#4caf50] transition">
                        <i className="fas fa-history"></i>
                        <span className="ml-2">View History</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-white text-lg">
                No resources found matching your criteria.
              </div>
            )}
          </div>

          {/* Load More Button */}
          {filteredResources.length > visibleCards && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                className="bg-[#151F14] hover:bg-opacity-80 text-white px-8 py-3 rounded-full transition border-2 border-[#4caf50]"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;