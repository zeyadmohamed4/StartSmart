import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "tailwindcss/tailwind.css";
import { jwtDecode } from 'jwt-decode';

function NavBar() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Decode token
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

  // Determine if current route should show buttons
  const visibleRoutes = [
    '/',
    '/auth',
    '/AddProject',
    '/Categories',
    '/SuccessStories',
    '/Home',
    '/TableOfContent',
    '/AboutUs',
    '/ContactUs',
    '/ProjectDetails',
    '/Payment',
    '/SignatureModal',
    '/StripeCard',
  ];

  const shouldShowButtons = visibleRoutes.some(route =>
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  // Scroll effect with dropdown close
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (isCategoryDropdownVisible) {
        setIsCategoryDropdownVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCategoryDropdownVisible]);

  // Set user data on location change
  useEffect(() => {
    const userData = decodeToken();
    if (userData) {
      setCurrentUser({
        userName: userData.username,
        role: userData.role
      });
    } else {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  }, [location]);

  // Profile click handler
  const handleProfileClick = () => {
    const userData = decodeToken();
    if (!userData) {
      navigate('/auth');
      return;
    }
    const { role } = userData;
    if (role === 'Admin') {
      navigate('/AdminHome');
    } else if (role === 'Owner') {
      navigate('/OwnerHome');
    } else if (role === 'Investor') {
      navigate('/InvestorHome');
    } else {
      navigate('/auth');
    }
  };

  // Categories list
  const categories = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Art & Design" },
    { id: 3, name: "Education" },
    { id: 4, name: "Science & Research" },
    { id: 5, name: "Business & Entrepreneurship" },
    { id: 6, name: "Entertainment" },
  ];

  // Handle category click
  const handleCategoryClick = (id) => {
    setIsCategoryDropdownVisible(false);
    navigate(`/Categories#${id}`);
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        const yOffset = -160;
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownVisible(!isCategoryDropdownVisible);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownElement = document.querySelector(".category-dropdown");
      if (
        isCategoryDropdownVisible &&
        dropdownElement &&
        !dropdownElement.contains(event.target)
      ) {
        setIsCategoryDropdownVisible(false);
      }
    };

    if (isCategoryDropdownVisible) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isCategoryDropdownVisible]);

  // Check active link
  const isActive = (path) => location.pathname === path;

  const baseLinkClasses =
    "relative text-[16px] px-2 py-2 text-gray-300 hover:text-blue-300 transition-all duration-1000 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[3px] after:bg-blue-300 after:transition-all after:duration-500 hover:after:w-full";

  const activeLinkClasses = "text-blue-300 font-bold after:w-full";

  const navBarStyle = isScrolled
    ? "bg-[#00192F] bg-opacity-90 shadow-md"
    : "bg-transparent";

  if (!shouldShowButtons) {
    return null;
  }

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');`}
      </style>
      <nav
        style={{ fontFamily: '"Open Sans", sans-serif' }}
        className={`navbar fixed top-0 left-0 w-full text-white z-50 h-[4.5rem] transition-all duration-500 ${
          location.pathname === '/auth' ? 'bg-[#131933]' : navBarStyle 
        }`}
      >
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 mx-4 mt-4">
            <h1 className="font-bold text-gray-300">Start Smart</h1>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
              <svg
                className="w-6 h-6 text-gray-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* Navigation links */}
          <div
            className={`${
              isDropdownVisible ? "block" : "hidden"
            } absolute top-full left-0 w-full md:static md:flex md:items-center md:space-x-6 md:w-auto flex-col md:flex-row bg-[#00192F] md:bg-transparent`}
          >
            <div className="flex flex-col justify-start text-blue-300 w-full space-y-2 md:flex-row md:space-y-0 md:space-x-4 md:w-auto mx-4 mt-3 font-sm">
              <Link to="/" className={`${baseLinkClasses} ${isActive("/") ? activeLinkClasses : ""}`}>
                Home
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative inline-block text-center md:text-left category-dropdown"
                onMouseEnter={() => setIsCategoryDropdownVisible(true)}
              >
                <button
                  onClick={toggleCategoryDropdown}
                  className="inline-flex items-center justify-center w-full px-2 text-[16px] py-2 text-gray-300 hover:text-blue-300 transition-all duration-600"
                >
                  Categories
                  <svg
                    className="ml-2 h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Category Dropdown Menu */}
                {isCategoryDropdownVisible && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-700 rounded-md shadow-lg z-[9999]">
                    <div className="py-1">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.id)}
                          className="block w-full px-4 py-2 text-sm text-white hover:bg-blue-400 text-center"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/AboutUs" className={`${baseLinkClasses} ${isActive("/AboutUs") ? activeLinkClasses : ""}`}>
                About Us
              </Link>
              <Link to="/ContactUs" className={`${baseLinkClasses} ${isActive("/ContactUs") ? activeLinkClasses : ""}`}>
                Contact Us
              </Link>

              <button
                onClick={handleProfileClick}
                className={`${baseLinkClasses} ${(isActive("/AdminHome") || isActive("/OwnerHome") || isActive("/InvestorHome")) ? activeLinkClasses : ""}`}
              >
                <i className="fa-solid fa-user-tie text-md"></i>
              </button>

              {currentUser ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                    alert('Your session has been ended');
                    navigate('/');
                  }}
                  className="bg-transparent text-[16px] text-center py-2 px-2 border border-blue-300 text-gray-300 hover:text-blue-300 bg-gray-300 rounded-full transition duration-600"
                >
                  Logout
                </button>
              ) : (
                location.pathname !== "/auth" && (
                  <Link
                    to="/auth"
                    className="bg-transparent text-[16px] text-center py-2 px-2 border border-blue-300 text-gray-300 hover:text-blue-300 bg-gray-300 rounded-full transition duration-600"
                  >
                    Login
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;