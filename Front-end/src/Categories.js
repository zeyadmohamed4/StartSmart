import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Project from './imgs/project.jpg';
import img from './imgs/ooyy.jpg';
import { jwtDecode } from 'jwt-decode';

function Categories() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("Technology");
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const categorySectionRef = useRef(null);

  const categories = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Art_Design" },
    { id: 3, name: "Education" },
    { id: 4, name: "Science_Research" },
    { id: 5, name: "Business_Entrepreneurship" },
    { id: 6, name: "Entertainment" },
  ];

  useEffect(() => {
    const hash = location.hash.substring(1);
    if (hash) {
      const category = categories.find(cat => cat.id.toString() === hash);
      if (category) {
        setActiveCategory(category.name);
      }
    }
  }, [location]);

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://localhost:7010/api/Project/GetAllCategoryCards', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const formattedProjects = response.data.map(project => ({
        ProjectId: project.id,
        InvestmentId: project.investmentId,
        InvestorName: project.investorName,
        ProjectName: project.projectName,
        Location: project.location,
        Country: project.country,
        NoOfInvestors: project.numberOfInvestors,
        Progress: project.progress,
        RaisedOfWhat: project.raisedOfWhat,
        Goal: project.goal,
        DaysLeft: project.daysLeft,
        Category: project.category,
        CategoryId: project.categoryId,
        CampaignDealType: project.campaignDealType,
        ProjectPhoto: project.photo,
        InvestmentStatus: project.investmentStatus,
        MinInvest: project.minInvestment,
        MaxInvest: project.maxInvestment,
        InvestmentAmount: project.investmentAmount
      }));


      setAllProjects(formattedProjects);
      localStorage.setItem('projectsData', JSON.stringify(formattedProjects));

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);


      // Try to get data from localStorage if API fails
      const storedData = localStorage.getItem('projectsData');
      if (storedData) {
        console.log(storedData);
        setAllProjects(JSON.parse(storedData));
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = allProjects.filter(
    (project) => project.Category === activeCategory
  );

  const handleCategoryClick = (category) => {
    setActiveCategory(category.name);
    navigate(`#${category.id}`, { replace: true });
    setTimeout(() => {
      categorySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  const handleInvestClick = (project) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // ✅ استخرج الدور (role) من التوكن
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role;

        if (role == 'Investor') {
          navigate('/Payment', {
            state: {
              ProjectName: project.ProjectName,
              InvestmentId: project.InvestmentId,
              InvestorName: project.InvestorName,
              ProjectId: project.ProjectId,
              CampaignDealType: project.CampaignDealType,
              InvestmentStatus: project.InvestmentStatus,
              CategoryId: project.CategoryId,
              MinInvest: project.MinInvest,
              MaxInvest: project.MaxInvest,
              InvestmentAmount: project.InvestmentAmount
            }
          });
        } else {
          alert('Only investors can access this feature');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        alert('Please login to continue');
      }
    } else {
      alert('Please login to continue');
      navigate('/auth');
    }
  };

  const handleViewDetails = (project) => {
    navigate('/ProjectDetails', {
      state: {
        ProjectId: project.ProjectId,
        CategoryId: project.CategoryId
      }
    });
  };

  return (
    <div className="relative w-full content">
      {/* Hero Section */}
      <div className="h-[660px] bg-center bg-cover relative w-full content" style={{ backgroundImage: `url(${img})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-white text-4xl font-bold mb-4">Discover Tomorrow's Innovations Today</h1>
          <p className="text-xl text-white max-w-2xl">Invest in groundbreaking ideas that shape the future</p>
        </div>
      </div>

      {/* Main section with categories and projects */}
      <div className="bg-[#00192F] p-10 -mt-20 relative z-10" ref={categorySectionRef}>
        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              id={category.id.toString()}
              onClick={() => handleCategoryClick(category)}
              className={`py-2 px-6 rounded-2xl font-semibold text-sm transition-all duration-300
                ${activeCategory === category.name
                  ? "bg-gray-200 text-[#3b5787] shadow-md font-[900]"
                  : "bg-transparent text-white border border-gray-200 hover:bg-white hover:text-[#3b5787]"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.ProjectId} className="bg-gray-300 text-black rounded-md p-3 shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <img src={project.ProjectPhoto} alt={project.ProjectName} className="w-full h-40 object-cover rounded-lg" />
              <div className="px-4">
                <div className="flex justify-between items-center py-4">
                  <div>

                    <h3 className="text-lg font-bold font-monst text-[#00192F] text-left">{project.ProjectName}</h3>
                    <p className="text-sm text-gray-600 font-lato text-left">
                      {project.Location}
                      <p className="text-sm text-gray-600 font-lato text-left">{project.Country}</p>
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm">{project.NoOfInvestors}</p>
                    <p className="text-sm">Investor{project.NoOfInvestors !== "1" ? "s" : ""}</p>
                  </div>
                </div>

                <div className="w-full bg-gray-500 h-1 my-2">
                  <div className="bg-green-500 h-1" style={{ width: `${project.Progress}%` }}></div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 text-left">
                  <div className="text-left mt-3">
                    <p>{project.RaisedOfWhat} </p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{project.DaysLeft}</p>
                    <p>Days Left</p>
                  </div>
                </div>

                <div className="mt-2 flex justify-between">
                  <button
                    onClick={() => handleViewDetails(project)}
                    className="bg-[#00192F] rounded-2xl font-bold mx-2 text-[11px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
                  >
                    View Project Details
                  </button>
                  <button
                    onClick={() => handleInvestClick(project)}
                    className="bg-[#00192F] rounded-2xl font-bold text-[13px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
                  >
                    Invest Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;