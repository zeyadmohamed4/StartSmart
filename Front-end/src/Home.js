import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import "tailwindcss/tailwind.css";
import project from './imgs/kl.jpg';
import homeSection3 from './imgs/homeSection3.jpg';
import homeSection4 from './imgs/homeSection4.jpg';
import people from './imgs/people.webp';
import gif from './imgs/gif.gif';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import NavBar from "./NavBar";
import welcomeVideo from "./imgs/large.mp4";
import book from "./imgs/ddd.jpg";
import handshake from "./imgs/hand.jpg";
import wallpaper from "./imgs/Design.jpeg";
import secondWallpaper from "./imgs/d.avif";
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CounterSection from './CounterSection.jsx';
import TestimonialSlider from './TestimonialSlider.jsx';
import ChatBox from './ChatBox.js';
import { useInView } from 'react-intersection-observer';
import { FaUsers, FaRegFileAlt, FaCloudDownloadAlt, FaCoffee } from 'react-icons/fa';
import axios from 'axios';

const Home = () => {
  // States
  const [startIndex, setStartIndex] = useState(0);
  const [isStartNowVisible, setIsStartNowVisible] = useState(false);
  const dropdownRef = useRef(null);
  const [numSuccessCards, setNumSuccessCards] = useState(5);
  const [numProjectsCards, setNumProjectsCards] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ Image: "", Name: "", Description: "" });
  const [isPaused, setIsPaused] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [projects, setProjects] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [isLoading, setIsLoading] = useState({
    Projects: true,
    SuccessStories: true,
    Feedbacks: true
  });

  const navigate = useNavigate();

  // Wallpaper Slideshow
  const wallpaperImages = [
    {
      src: wallpaper,
      text: "Welcome to our world !",
      subtext: "Where vision meets execution and dreams become reality"
    },
    {
      src: secondWallpaper,
      text: "The place where innovation meets opportunity",
      subtext: "Start Smart is your gateway to changing ideas into impactful ventures"
    }
  ];

  // Fetch projects from API
  const categoryMap = [
    "Technology",
    "Art_Design",
    "Education",
    "Science_Research",
    "Business_Entrepreneurship",
    "Entertainment"
  ];

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('https://localhost:7010/api/Prediction/getrecommendations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setProjects(response.data.map(project => ({
        Id: project.id,
        Title: project.projectName,
        Description: project.description,
        Category: categoryMap[project.category] || project.category, // تحويل الرقم إلى نص
        Image: project.image
      })));

      setIsLoading(prev => ({ ...prev, projects: false }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(Array.from({ length: 10 }, (_, index) => ({
        Id: index + 1,
        Title: `Project ${index + 1}`,
        Description: "A sustainable project focused on eco-friendly solutions",
        Category: `Category ${index + 1}`,
        Image: project
      })));
      setIsLoading(prev => ({ ...prev, projects: false }));
    }
  };

  // Fetch success stories from API
  const fetchSuccessStories = async () => {
    try {
      const response = await axios.get('https://localhost:7010/api/SuccessStory/GetRandom');
      setSuccessStories(response.data.map(story => ({
        Id: story.id,
        ProjectName: story.projectName,
        Title: story.Title || story.name,
        Category: story.category,
        Image: story.userImage
      })));
      setIsLoading(prev => ({ ...prev, successStories: false }));
    } catch (error) {
      console.error('Error fetching success stories:', error);
      // Fallback to dummy data
      setSuccessStories(Array.from({ length: 15 }, (_, index) => ({
        Id: index + 1,
        ProjectName: `Project ${index + 1}`,
        Title: `Entrepreneur ${index + 1}`,
        Category: `Category ${index + 1}`,
        Date: `2023-01-${index + 1}`,
        Image: people
      })));
      setIsLoading(prev => ({ ...prev, successStories: false }));
    }
  };

  // Search projects API
  const searchProjects = async (query) => {
    if (query.length < 1) {
      setSearchResults([]);
      setIsPaused(false); // Resume animation when search is cleared
      return;
    }

    setIsPaused(true); // Pause animation during search
    try {
      const response = await axios.get(`https://localhost:7010/api/Project/Search`, {
        params: {
          Query: query   // <-- هنا بتحطي قيمة البحث
        }
      });


      setSearchResults(response.data.map(project => ({
        Id: project.id,
        ProjectName: project.projectName,
      })));
    } catch (error) {
      console.error('Error searching projects:', error);
      setSearchResults([]);
    }

  };

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length === 0) {
      setSearchResults([]);
      setIsPaused(false); // Resume animation
      return;
    }

    setIsPaused(true); // Pause animation during search

    const timer = setTimeout(() => {
      searchProjects(query);
    }, 500);

    return () => clearTimeout(timer);
  };

  // New handler for focus
  const handleSearchFocus = () => {
    setIsPaused(true); // Pause on focus
  };


  useEffect(() => {
    fetchProjects();
    fetchSuccessStories();
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentWallpaper((prev) => (prev + 1) % wallpaperImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigateToProjectDetails = (projectId) => {
    console.log("Navigating to project:", projectId);

    // Retrieve all projects from localStorage
    const storedProjects = JSON.parse(localStorage.getItem('projectsData')) || [];

    // Find the project with the matching ProjectId
    const project = storedProjects.find(p => p.ProjectId == projectId);

    if (project) {
      // Navigate with the full project data
      navigate('/ProjectDetails', {
        state: {
          ProjectId: project.ProjectId,
          ProjectName: project.ProjectName,
          Location: project.Location,
          Country: project.Country,
          NoOfInvestors: project.NoOfInvestors,
          Progress: project.Progress,
          RaisedOfWhat: project.RaisedOfWhat,
          Goal: project.Goal,
          DaysLeft: project.DaysLeft,
          Category: project.Category,
          CategoryId: project.CategoryId,
          CampaignDealType: project.CampaignDealType,
          ProjectPhoto: project.ProjectPhoto,
          InvestmentStatus: project.InvestmentStatus,
          MinInvest: project.MinInvest,
          MaxInvest: project.MaxInvest,
          InvestmentAmount: project.InvestmentAmount
        }
      });
    } else {
      console.error("Project not found in localStorage");
      // Fallback: Navigate with just the ID if project not found
      navigate('/ProjectDetails', {
        state: {
          ProjectId: projectId
        }
      });
    }
  };

  // Handle project navigation
  const handleNext = () => {
    setStartIndex(prev => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setStartIndex(prev => (prev - 1 + projects.length) % projects.length);
  };

  const getVisibleProjects = () => {
    return [
      projects[startIndex],
      projects[(startIndex + 1) % projects.length],
      projects[(startIndex + 2) % projects.length]
    ];
  };

  // Handle success stories navigation
  const handleNextSuccess = () => {
    setStartIndex((prev) => (prev + numSuccessCards >= successStories.length ? 0 : prev + 1));
  };

  const handlePrevSuccess = () => {
    setStartIndex((prev) => (prev === 0 ? successStories.length - numSuccessCards : prev - 1));
  };

  const handleStartNowClick = () => {
    setIsStartNowVisible((prev) => !prev);
  };

  // Handle navigation to project owner or investor pages
  const handleRoleNavigation = (path) => {
    // Special case: Categories is always accessible
    if (path === '/Categories') {
      navigate('/Categories');
      return;
    }

    // For all other paths, check authentication
    const decodeToken = () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      try {
        const decoded = jwtDecode(token);
        return {
          userId: decoded.nameid || decoded.userId,
          username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded?.username,
          role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role
        };
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    };

    const userData = decodeToken();

    if (!userData) {
      alert('You have to log in first');
      navigate('/Auth');
      return;
    }

    if (path === '/AddProject') {
      if (userData.role === 'Owner' || userData.role === 'owner') {
        navigate('/AddProject');
      } else {
        alert('Only project owners can access this feature');
      }
    } else {
      navigate(path);
    }
  };

  const handleSeeMoreClick = (id) => {
    navigate('/SuccessStories', { state: { id: id } });
  };

  // Handle success story navigation
  const handleSuccessStoryNavigation = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Not logged in, go to main Success Stories page
      navigate('/SuccessStories');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role;

      if (role === 'Owner') {
        // Owner: Navigate to form section
        navigate('/SuccessStories#SuccessForm');
      } else {
        // Not an owner: Redirect to general page
        navigate('/SuccessStories');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      // On error, just redirect to safe page
      navigate('/SuccessStories');
    }
  };;

  // Responsive Cards Calculation
  useEffect(() => {
    const updateCardsCount = () => {
      const width = window.innerWidth;
      setNumProjectsCards(width >= 1024 ? 3 : width >= 768 ? 3 : 2);
      setNumSuccessCards(width >= 1024 ? 5 : width >= 768 ? 4 : 3);
    };

    updateCardsCount();
    window.addEventListener("resize", updateCardsCount);
    return () => window.removeEventListener("resize", updateCardsCount);
  }, []);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsStartNowVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // Handle search click
  const handleSearchClick = () => {
    setIsPaused(true);

  };


  return (
    <>
      {/* section 2 quote */}

      <style>
        {`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(10); }
    }
    .animate-fadeIn {
      animation: fadeIn 1.2s ease-out forwards;
    }
  `}
      </style>




      <div className="min-h-screen w-full overflow-hidden relative font-lato text-gray-600">
        <AnimatePresence mode="wait">
          {wallpaperImages.map((wallpaper, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentWallpaper === index ? 1 : 0,
                transition: { duration: isPaused ? 0 : 1.6 }
              }}
              className="absolute w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${wallpaper.src})`,
                zIndex: currentWallpaper === index ? 10 : 0,
                pointerEvents: currentWallpaper === index ? "auto" : "none"
              }}
            >
              <div className="bg-black bg-opacity-50 py-20 px-4 min-h-screen">
                <NavBar />
                {currentWallpaper === index && (
                  <AnimatePresence mode="wait">
                    {index === 0 ? (
                      <motion.div
                        key="text-right"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { duration: isPaused ? 0 : 0.8 }
                        }}
                        exit={{ opacity: 0 }}
                        className="flex justify-end mx-4 p-8"
                      >
                        <div className="text-right py-16 text-gray-300 w-full md:w-2/3 lg:w-1/2">
                          <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: {
                                delay: isPaused ? 0 : 0.6,
                                duration: isPaused ? 0 : 0.7
                              }
                            }}
                            className="text-3xl md:text-4xl lg:text-5xl mt-24 mb-4"
                          >
                            {wallpaper.text}
                          </motion.h1>
                          <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: {
                                delay: isPaused ? 0 : 0.9,
                                duration: isPaused ? 0 : 0.7
                              }
                            }}
                            className="text-md md:text-md mb-8 font-normal py-2"
                          >
                            {wallpaper.subtext}
                          </motion.p>
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: {
                                delay: isPaused ? 0 : 1.2,
                                duration: isPaused ? 0 : 0.7
                              }
                            }}
                            className="flex items-center justify-end mt-6 mb-4 w-full"
                          >

                            <div className="flex items-center justify-end mt-6 mb-4 w-full relative">
                              <div
                                className="flex items-center p-2 mt-6 border-cyan-900 border-2 rounded-2xl w-2/3 md:w-1/2 mx-2 hover:scale-105 transition-transform duration-1000"
                                onClick={handleSearchClick}
                              >
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white mr-2" />
                                <input
                                  type="text"
                                  placeholder="Search for projects..."
                                  className="w-full text-white bg-transparent outline-none text-lg placeholder-gray-300"
                                  value={searchQuery}
                                  onChange={handleSearchChange}
                                  onFocus={handleSearchFocus} // Add this line

                                />
                              </div>
                              <button
                                className="bg-transparent rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
                                onClick={handleSearchClick}
                              >
                                Search
                              </button>

                              {/* Search results dropdown */}
                              {/* Styled Search Results Dropdown */}
                              {searchResults.length > 0 && (
                                <div className="absolute top-full right-24 mt-2 w-2/5 md:w-1/2  bg-white rounded-xl shadow-2xl  h-48
   overflow-y-auto z-50 overflow-hidden border border-gray-200 text-left">
                                  {searchResults.map((project) => (
                                    <div
                                      key={project.Id}
                                      className="px-5 py-4 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-b last:border-b-0 border-gray-100"
                                      onClick={() => navigateToProjectDetails(project.Id)}
                                    >
                                      <h4 className="font-bold text-lg text-gray-800 hover:text-blue-600 transition-colors">
                                        {project.ProjectName}
                                      </h4>
                                      <p className="text-sm text-gray-500 mt-1">Click to view details</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="text-left"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { duration: isPaused ? 0 : 0.8 }
                        }}
                        exit={{ opacity: 0 }}
                        className="flex justify-start mx-4 mb-6"
                      >
                        <div className="text-left py-16 text-gray-300 w-full md:w-2/3 lg:w-1/2">
                          <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: {
                                delay: isPaused ? 0 : 0.6,
                                duration: isPaused ? 0 : 0.7
                              }
                            }}
                            className="text-3xl md:text-4xl lg:text-5xl mt-24 mb-4"
                          >
                            {wallpaper.text}
                          </motion.h1>
                          <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: {
                                delay: isPaused ? 0 : 0.9,
                                duration: isPaused ? 0 : 0.7
                              }
                            }}
                            className="text-lg md:text-l mb-8 py-2"
                          >
                            {wallpaper.subtext}
                          </motion.p>
                          <motion.button
                            initial={{ opacity: 0, y: 30 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: {
                                delay: isPaused ? 0 : 1.2,
                                duration: isPaused ? 0 : 0.7
                              }
                            }}
                            className="bg-transparent rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
                            onClick={() => {
                              const section = document.getElementById("2");
                              if (section) {
                                section.scrollIntoView({ behavior: "smooth" });
                              }
                            }}
                          >
                            Explore Now
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>



      {/* section 2 - Explore Startups */}
      <div id="2" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#eceff1] w-full">
        <h2 className="relative inline-block text-3xl text-center text-[#00192F] font-monst font-[800] mb-8 mx-auto">
          Explore Startups
          <div className="mt-2">
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-[70px] border-t border-b border-blue-300 py-[5px]"></span>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-[160px] h-[1px] bg-blue-300"></span>
          </div>
        </h2>

        <p className="text-center text-gray-500 mb-6 max-w-3xl mx-auto font-opensans">
          Where dreams meet their first step
        </p>

        <div className="max-w-7xl mx-auto relative">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-[37%] -translate-y-1/2 z-10 bg-[#00192F] hover:bg-blue-300 text-white p-3 rounded-full shadow-md hover:text-blue-700 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-[37%] -translate-y-1/2 z-10 bg-[#00192F] hover:bg-blue-300 text-white p-3 rounded-full shadow-md hover:text-blue-700 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {isLoading.projects ? (
            <div className="flex justify-center items-center h-[500px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-hidden w-full max-w-[1190px] mx-auto px-0 h-[500px]">
              <motion.div
                className="flex"
                initial={false}
                animate={{
                  x: `-${startIndex * (100 / 3)}%`,
                  transition: { type: "spring", stiffness: 300, damping: 30 }
                }}
              >
                {[...projects, ...projects.slice(0, 2)].map((project, index) => (
                  <motion.div
                    key={`${project.Id}-${index}`}
                    className="flex-shrink-0 w-1/3 px-3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: (index % 3) * 0.15,
                        duration: 0.5
                      }
                    }}
                  >
                    <div className="rounded-md h-[430px] relative overflow-hidden group shadow-md">
                      <motion.img
                        src={project.Image || project.ProjectPhoto || project}
                        alt={project.ProjectName}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-60 text-white flex flex-col justify-center items-center translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out px-4 text-center">
                        <p className="text-sm mb-2 py-4 font-lato">{project.Description}</p>
                        <button
                          onClick={() => navigateToProjectDetails(project.Id)}
                          className="text-gray-300 text-[17px] font-bold font-lato hover:text-blue-300 border-blue-300 border-2 shadow-md px-2 py-2 rounded-md"
                        >
                          Read more +
                        </button>
                      </div>
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent py-4">
                        <h4 className="text-white text-center text-sm font-lato">{project.Category}</h4>
                        <h4 className="text-white text-center text-xl font-lato">{project.Title}</h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}


          <div className="mt-8 text-center">
            <Link
              to="/categories"
              className="inline-block bg-[#00192F] rounded-2xl font-bold text-[17px] font-monst text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
            >
              More Projects
            </Link>
          </div>
        </div>
      </div>


      {/* Section 4 - Welcome Platform */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 w-[1250px] rounded-md relative overflow-hidden">
        {/* Background Video */}
        <video
          src={welcomeVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />

        {/* Dark overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col md:flex-row items-center py-20 mt-10 pl-14">
          <div className="md:w-1/2">
            <div className="text-center md:text-left md:ml-10 mb-8" ref={dropdownRef}>
              <h2 className="text-3xl text-white font-bold mb-4">
                Empowering You to Build Tomorrow
              </h2>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl font-opensans">
                It's your time to make an impact, whether by launching your own startup or funding the next big idea.
              </p>

              <button
                className="bg-transparent rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
                onClick={handleStartNowClick}
              >
                Start your journey
              </button>

              {isStartNowVisible && (
                <div className="absolute z-30 w-56 origin-top-right rounded-md bg-blue-400 mt-2">
                  <div className="py-1">
                    <button
                      onClick={() => handleRoleNavigation("/AddProject")}
                      className="block w-full font-lato px-4 py-2 text-[17px] text-[#00192F] hover:bg-gray-300 text-center"
                    >
                      As a project owner
                    </button>
                    <button
                      onClick={() => handleRoleNavigation("/Categories")}
                      className="block w-full font-lato px-4 py-2 text-[17px] text-[#00192F] hover:bg-gray-300 text-center"
                    >
                      As an Investor
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      <CounterSection />

      <TestimonialSlider />

      <div className="w-[1250px] font-lato">
        <div className="flex flex-col md:flex-row h-auto mt-20 overflow-hidden mx-4 shadow-lg rounded-md">

          {/* Left Section - ProjectName */}
          <div className="bg-[#00192F] text-white flex items-end justify-end md:w-[48%] w-full py-16 px-10">
            <h2 className="text-6xl font-bold font-amatic text-right leading-snug text-gray-300">
              TABLE of <br /> CONTENTS
            </h2>
          </div>

          {/* Right Section - List */}
          <div className="bg-gray-300 text-[#1f3c45] md:w-[52%] w-full py-12 px-8 font-opensans text-[20px] ">
            <ol className="space-y-6">
              <li>
                <Link
                  to="/tablecontent#section-1"  // Changed to include section ID
                  className="font-semibold block transform transition duration-300 hover:scale-105 hover:text-[#00192F]"
                >
                  .What do you need to start a business
                </Link>
              </li>
              <li>
                <Link
                  to="/tablecontent#section-2"  // Changed to include section ID
                  className="font-semibold block transform transition duration-300 hover:scale-105 hover:text-[#00192F]"
                >
                  .How to start a business
                </Link>
              </li>
              <li>
                <Link
                  to="/tablecontent#section-3"  // Changed to include section ID
                  className="font-semibold block transform transition duration-300 hover:scale-105 hover:text-[#00192F]"
                >
                  .How to make a business plan
                </Link>
              </li>
              <li>
                <Link
                  to="/tablecontent#section-4"  // Changed to include section ID
                  className="font-semibold block transform transition duration-300 hover:scale-105 hover:text-[#00192F]"
                >
                  .Funding for your new business
                </Link>
              </li>
              <li>
                <Link
                  to="/tablecontent#section-5"  // Changed to include section ID
                  className="font-semibold block transform transition duration-300 hover:scale-105 hover:text-[#00192F]"
                >
                  .Campaign deal type
                </Link>
              </li>
            </ol>
          </div>
        </div>
      </div>


      {/* Section 6 - Success Stories */}
      <div className="py-20 mt-20 rounded-md relative bg-[#00192F] flex flex-col items-center mx-4 w-[1250px]">
        <p className="text-center text-gray-300 font-monst font-[800] mb-8 mx-auto">
          These startups made it — and so can you..
        </p>
        <h3 className="text-center text-gray-200 text-xl mb-6 max-w-3xl mx-auto font-opensans animate-fadeIn fadeIn">
          Here are some of our Success Stories
        </h3>

        {/* Previous Button with SVG */}
        <button
          className="absolute left-12 top-[50%] bg-gray-300 hover:bg-blue-300 text-[#00192F] p-3 rounded-full shadow-md hover:text-blue-700 transition-all duration-300"
          onClick={handlePrevSuccess}
          disabled={startIndex === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {isLoading.SuccessStoriesuccessStories ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="relative flex items-center w-3/4">
            <div className="flex space-x-6 justify-center w-3/4 transition-all ml-32">
              {successStories.slice(startIndex, startIndex + numSuccessCards).map((story) => (
                <div
                  key={story.Id}
                  className="bg-[#eceff1] border-2 shadow-md rounded-lg p-2 w-48 flex-shrink-0 transition-all transform hover:scale-105 hover:translate-y-1"
                >
                  <img
                    src={story.Image || story.UserPhoto || people}
                    alt={story.Title}
                    className="rounded-t-lg w-full h-44 object-cover"
                  />
                  <h2 className="text-md font-bold mt-2 font-monst text-gray-900 text-center">
                    {story.Title || story.UserName}
                  </h2>
                  <h2 className="text-sm font-semibold py-3 font-lato text-gray-700 text-center">
                    {story.ProjectName}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 font-lato text-center">
                    {story.Category}
                  </p>
                  <div className="mt-3 flex justify-center">
                    <button
                      onClick={() => handleSeeMoreClick(story.Id)}
                      className="bg-[#00192F] rounded-2xl font-bold text-[15px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
                    >
                      See More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Next Button with SVG */}
        <button
          className="absolute right-8 top-[50%] bg-gray-300 hover:bg-blue-300 text-[#00192F] p-3 rounded-full shadow-md hover:text-blue-700 transition-all duration-300"
          onClick={handleNextSuccess}
          disabled={startIndex + numSuccessCards >= successStories.length}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Share Success Story Link */}
        <div className="mt-14">
          <button
            onClick={handleSuccessStoryNavigation}
            className="bg-[#00192F] rounded-2xl font-bold text-[17px] font-monst mt-6 text-gray-300 py-2 px-4 border-2 border-cyan-900 hover:bg-gray-300 hover:text-blue-700 transition-all duration-500"
          >
            Share Your Success Story Now
          </button>
        </div>
      </div>

      <ChatBox />


    </>
  );
};

export default Home;