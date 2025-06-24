import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faBuilding, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faChartLine, faIndustry } from '@fortawesome/free-solid-svg-icons';
import { Bar, Line } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { faMagnifyingGlass, faUser, faHome, faHandshake, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultProfileImage from './imgs/Rawana.jpg';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function InvestorHome() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    roi: 0,
    annualGrowth: 0,
    fundedSector: "Loading...",
    totalDividends: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    name: "",
    role: "Investor",
    profileImage: null
  });
  const [monthlyGrowth, setMonthlyGrowth] = useState([]);
  const [revenueDistribution, setRevenueDistribution] = useState([]);
  const [projectsGrowth, setProjectsGrowth] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;


  const handleLogout = () => {
    localStorage.removeItem("token");
    alert('Your session has been ended');
    navigate("/");
  };
  const menuItems = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Profile', path: '/InvestorProfile', icon: faUser },
    { label: 'My Investments', path: '/InvestorProjects', icon: faHandshake },
    { label: 'Notifications', path: '/InvestorNotifications', icon: faBell },
    { label: 'Logout', onClick: handleLogout, icon: faSignOutAlt },

  ];

  // Extract user data from token and fetch profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const extractedUsername = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded?.username || 'User';

      setUserData(prev => ({
        ...prev,
        username: extractedUsername,
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role || 'Investor',
      }));

      // Fetch profile data
      const fetchProfile = async () => {
        try {
          const response = await axios.get(`https://localhost:7010/api/Profile/profile?username=${extractedUsername}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setUserData(prev => ({
              ...prev,
              name: response.data.info?.name || extractedUsername,
              profileImage: response.data.info?.image || null
            }));
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setUserData(prev => ({
            ...prev,
            name: extractedUsername,
            profileImage: null
          }));
        }
      };

      fetchProfile();
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/auth');
    }
  }, [navigate]);

  // Fetch ROI percentage
  const fetchROI = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/InvestorDashboard/ROI/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ROI data:', error);
      return 12.5; // Default value if API fails
    }
  };

  // Fetch average annual growth
  const fetchAnnualGrowth = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/InvestorDashboard/Avg.AnnualGrowthPercentage/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching annual growth data:', error);
      return 8.2; // Default value if API fails
    }
  };

  // Fetch most funded category - updated to handle object response
  const fetchMostFundedCategory = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/InvestorDashboard/MostFundedCategories/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Handle both string and object responses
      if (typeof response.data === 'string') {
        return response.data;
      } else if (typeof response.data === 'object' && response.data !== null) {
        // Get the first category name from the object
        const categories = Object.keys(response.data);
        return categories.length > 0 ? categories[0] : "Technology";
      }
      return "Technology"; // Default value if response is unexpected
    } catch (error) {
      console.error('Error fetching most funded category:', error);
      return "Technology"; // Default value if API fails
    }
  };

  // Fetch total dividends earned
  const fetchTotalDividends = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/InvestorDashboard/TotalDividendsEarned/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.totalDividendsEarned || 0;
    } catch (error) {
      console.error('Error fetching total dividends:', error);
      return 0;
    }
  };

  // Fetch monthly growth data
  const fetchMonthlyGrowth = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/InvestorDashboard/investor-growth/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly growth data:', error);
      return [
        { month: "Jan", netRevenue: 5000 },
        { month: "Feb", netRevenue: 7500 },
        { month: "Mar", netRevenue: 8500 },
        { month: "Apr", netRevenue: 9500 },
        { month: "May", netRevenue: 11000 },
        { month: "Jun", netRevenue: 12500 }
      ];
    }
  };

  // Fetch revenue distribution data
  const fetchRevenueDistribution = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/InvestorDashboard/Revenue-Distrubtion/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue distribution data:', error);
      return [
        { projectName: "Entertainment Plus", roi: 10 },
        { projectName: "Artistic Minds", roi: 20 }
      ];
    }
  };

  // Fetch projects growth over time data
  const fetchProjectsGrowth = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/InvestorDashboard/projects-Growth_OverTime/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching projects growth data:', error);
      return [
        {
          year: 2025,
          month: 5,
          projects: [
            { projectName: "Entertainment Plus", netRevenue: 500 },
            { projectName: "Artistic Minds", netRevenue: 1000 }
          ]
        }
      ];
    }
  };

  // Process projects growth data for chart
  const processProjectsGrowthData = (data) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Group by month and get unique project names
    const months = [...new Set(data.map(item => `${monthNames[item.month - 1]} ${item.year}`))];
    const projectNames = [...new Set(data.flatMap(item => item.projects.map(p => p.projectName)))];

    // Create datasets for each project
    const datasets = projectNames.map(projectName => {
      const projectData = months.map(month => {
        const [monthName, year] = month.split(' ');
        const monthData = data.find(
          item => monthNames[item.month - 1] === monthName && item.year === parseInt(year)
        );

        if (monthData) {
          const project = monthData.projects.find(p => p.projectName === projectName);
          return project ? project.netRevenue : 0;
        }
        return 0;
      });

      // Generate random color for each project
      const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;

      return {
        label: projectName,
        data: projectData,
        borderColor: color,
        backgroundColor: color.replace('0.6', '0.2'),
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#ffffff",
        pointRadius: 4,
      };
    });

    return {
      labels: months,
      datasets: datasets
    };
  };
  const dummyData = {
    roi: 12.5,
    annualGrowth: 8.2,
    fundedSector: "Technology",
    totalDividends: 45,
    investmentGrowth: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [10000, 20000, 40000, 70000, 110000, 150000]
    },
    investmentReturns: {
      labels: ["Tech startup", "Healthcare"],
      values: [9600, 15000]
    },
    projectGrowth: {
      labels: ["Jan", "Feb", "Mar", "Apr"],
      datasets: [
        {
          label: "Project Alpha",
          values: [10000, 12000, 14000, 18000]
        },
        {
          label: "Project Beta",
          values: [20000, 24000, 28000, 35000]
        }
      ]
    }
  };

  // API endpoint configuration
  const API_ENDPOINTS = {
    dashboard: "/api/investor/dashboard",
    investmentGrowth: "/api/investor/investment-growth",
    investmentReturns: "/api/investor/investment-returns",
    projectGrowth: "/api/investor/project-growth"
  };

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };
  // Fetch all dashboard data
  const fetchDashboardData = async (username) => {
    try {
      // Fetch all data in parallel
      const [
        roiData,
        annualGrowthData,
        fundedCategoryData,
        totalDividendsData,
        growthData,
        distributionData,
        projectsGrowthData
      ] = await Promise.all([
        fetchROI(username),
        fetchAnnualGrowth(username),
        fetchMostFundedCategory(username),
        fetchTotalDividends(username),
        fetchMonthlyGrowth(username),
        fetchRevenueDistribution(username),
        fetchProjectsGrowth(username)
      ]);

      // Update dashboard data
      setDashboardData({
        roi: roiData,
        annualGrowth: annualGrowthData,
        fundedSector: fundedCategoryData,
        totalDividends: totalDividendsData
      });

      setMonthlyGrowth(growthData);
      setRevenueDistribution(distributionData);
      setProjectsGrowth(projectsGrowthData);
      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch data. Showing sample data.");
      setDashboardData({
        roi: 12.5,
        annualGrowth: 8.2,
        fundedSector: "Technology",
        totalDividends: 45
      });
      setMonthlyGrowth([
        { month: "Jan", netRevenue: 5000 },
        { month: "Feb", netRevenue: 7500 },
        { month: "Mar", netRevenue: 8500 },
        { month: "Apr", netRevenue: 9500 },
        { month: "May", netRevenue: 11000 },
        { month: "Jun", netRevenue: 12500 }
      ]);
      setRevenueDistribution([
        { projectName: "Entertainment Plus", roi: 10 },
        { projectName: "Artistic Minds", roi: 20 }
      ]);
      setProjectsGrowth([
        {
          year: 2025,
          month: 5,
          projects: [
            { projectName: "Entertainment Plus", netRevenue: 500 },
            { projectName: "Artistic Minds", netRevenue: 1000 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData.username) {
      fetchDashboardData(userData.username);
    }
  }, [userData.username]);

  // Chart options with white text
  const getChartOptions = (title) => ({
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title,
        color: '#ffffff',
        font: {
          size: 16
        }
      },
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        backgroundColor: '#00192f',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#4A9CCD',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            if (context.dataset.label === 'ROI (%)') {
              return `${context.dataset.label}: ${context.raw}%`;
            }
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
          callback: function (value) {
            if (title.includes("Distribution")) {
              return `${value}%`;
            }
            return `$${value.toLocaleString()}`;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        }
      }
    },
  });

  // Prepare chart data
  // Replace dynamic chart data with static data
  const getChartData = () => {
    return {
      investmentGrowth: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Monthly Net Revenue ($)",
            data: [10000, 20000, 40000, 30000, 24000, 53000],
            borderColor: "#4A9CCD",
            backgroundColor: "rgba(74, 156, 205, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: "#ffffff",
            pointRadius: 4,
          },
        ],
      },
      investmentReturns: {
        labels: ["EduTech World", "BioTech Advance"],
        datasets: [
          {
            label: "ROI (%)",
            data: [9600, 15000],
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      projectGrowth: {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [
          {
            label: "BioTech Advance",
            data: [10000, 9000, 14000, 13000],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: "#ffffff",
            pointRadius: 4,
          },
          {
            label: "EduTech World",
            data: [20000, 15000, 10000, 35000, 50000],
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: "#ffffff",
            pointRadius: 4,
          }
        ]
      }
    };
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const chartsDiv = document.getElementById("charts-container");
    html2canvas(chartsDiv).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 10, 180, 160);
      doc.save("investment-report.pdf");
    });
  };

  if (loading) {
    return (
      <div className="content w-full flex bg-[#d8dbdd] justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A9CCD]"></div>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="content w-full flex bg-[#d8dbdd]">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {error}
        </div>
      )}

      <div className="w-full flex">
        <div className="flex w-full">
          {/* Sidebar */}
          <div className="w-[230px] py-6 rounded-xl bg-gradient-to-b from-[#00192f] to-[#4A9CCD] text-gray-400 font-semibold shadow-md hidden sm:block sticky top-20">
            <div className="flex flex-col items-center mt-12">
              <img
                src={userData.profileImage || defaultProfileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-md object-cover"
                onError={(e) => {
                  e.target.src = defaultProfileImage;
                }}
              />
              <h3 className="mt-2 text-sm text-gray-300">{userData.name || userData.username}</h3>
              <p className="text-xs text-gray-400">{userData.role}</p>

              <div className="flex items-center py-[5px] mt-6 border-cyan-900 border-2 rounded-full w-full md:w-[200px] px-8 mx-2">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-300 mr-2 text-sm" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full text-white bg-transparent outline-none text-lg placeholder-gray-300"
                />
              </div>
            </div>

            <ul className="mt-6 space-y-4 mx-4">
              {menuItems.map((item, index) => {
                const isActive = item.path === currentPath;
                return (
                  <li key={index}>
                    {item.path ? (
                      <a
                        href={item.path}
                        className={`flex items-center py-2 px-4 rounded-lg text-[16px] transition-colors 
                          ${isActive ? 'bg-gray-400 text-white' : 'text-gray-400 hover:bg-gray-400 hover:text-white'}
                        `}
                      >
                        <FontAwesomeIcon icon={item.icon} className="mr-3" />
                        {item.label}
                      </a>
                    ) : (
                      <button
                        onClick={item.onClick}
                        className={`flex items-center py-2 px-4 rounded-lg text-[16px] transition-colors 
                          w-full text-left text-gray-400 hover:bg-gray-400 hover:text-white
                        `}
                      >
                        <FontAwesomeIcon icon={item.icon} className="mr-3" />
                        {item.label}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-full mt-[30px] font-monst">
            <h2 className="text-2xl text-[#00192f] text-left mt-12 font-monst font-[1000] mx-6">Dashboard</h2>
            <hr className="my-6 border-gray-400 w-[1250px] mx-auto" />

            <div id="charts-container">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 p-6">
                {/* Card 1: ROI (Return on Investment) Percentage */}
                <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transform transition duration-300 hover:scale-105">
                  <FontAwesomeIcon icon={faChartLine} className="text-gray-200 text-2xl absolute top-8 left-4" />
                  <div className="flex items-center justify-between mt-12 ml-8">
                    <div>
                      <span className="text-sm text-gray-300">ROI (Return on Investment)</span>
                      <h4 className="text-2xl font-bold text-gray-200">29.99%</h4>
                    </div>
                  </div>
                  <hr className="my-4 border-gray-300" />
                  <div>
                    <p className="text-sm text-green-300">
                      <span className="font-bold">+5%</span> from last quarter
                    </p>
                  </div>
                </div>

                {/* Card 2: Avg. Annual Investment Growth */}
                <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transform transition duration-300 hover:scale-105">
                  <FontAwesomeIcon icon={faChartSimple} className="text-gray-200 text-2xl absolute top-8 left-4" />
                  <div className="flex items-center justify-between mt-12 ml-8">
                    <div>
                      <span className="text-sm text-gray-300">Avg. Annual Investment Growth</span>
                      <h4 className="text-2xl font-bold text-gray-200">182$ K</h4>
                    </div>
                  </div>
                  <hr className="my-4 border-gray-300" />
                  <div>
                    <p className="text-sm text-green-300">
                      <span className="font-bold">+2%</span> from last year
                    </p>
                  </div>
                </div>

                {/* Card 3: Most Funded Sector - Updated to handle object response */}
                <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transform transition duration-300 hover:scale-105">
                  <FontAwesomeIcon icon={faIndustry} className="text-gray-200 text-2xl absolute top-8 left-4" />
                  <div className="flex items-center justify-between mt-12 ml-8">
                    <div>
                      <span className="text-sm text-gray-300">Most Funded Sector</span>
                      <h4 className="text-2xl font-bold text-gray-200">
                        {typeof dashboardData.fundedSector === 'string'
                          ? dashboardData.fundedSector
                          : Object.keys(dashboardData.fundedSector)[0]}
                      </h4>
                    </div>
                  </div>
                  <hr className="my-4 border-gray-300" />
                  <div>
                    <p className="text-sm text-green-300">Updated this month</p>
                  </div>
                </div>

                {/* Card 4: Total Dividends Earned */}
                <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transform transition duration-300 hover:scale-105">
                  <FontAwesomeIcon icon={faDollarSign} className="text-gray-200 text-2xl absolute top-8 left-4" />
                  <div className="flex items-center justify-between mt-12 ml-8">
                    <div>
                      <span className="text-sm text-gray-300">Total Dividends Earned</span>
                      <h4 className="text-2xl font-bold text-gray-200">
                        {`378$`}K
                      </h4>
                    </div>
                  </div>
                  <hr className="my-4 border-gray-300" />
                  <div>
                    <p className="text-sm text-green-300">
                      <span className="font-bold">+10%</span> from last quarter
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105">
                  <Line
                    data={chartData.investmentGrowth}
                    options={getChartOptions("Monthly Revenue Growth")}
                    className="mt-14"
                  />
                  <hr className="my-2 border-gray-300" />
                  <h6 className="text-lg font-semibold text-white">Monthly Revenue Growth</h6>
                  <div className="text-sm text-gray-200">
                    Shows your monthly net revenue growth over time
                  </div>
                </div>

                <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105">
                  <Bar
                    data={chartData.investmentReturns}
                    options={getChartOptions("Revenue Distribution by Project")}
                    className="mt-14"
                  />
                  <hr className="my-2 border-gray-300" />
                  <h6 className="text-lg font-semibold text-white">Revenue Distribution by Project</h6>
                  <div className="text-sm text-gray-200">
                    Shows ROI percentage for each invested project
                  </div>
                </div>

                <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105">
                  <Line
                    data={chartData.projectGrowth}
                    options={getChartOptions("Project Growth Over Time")}
                    className="mt-14"
                  />
                  <hr className="my-2 border-gray-300" />
                  <h6 className="text-lg font-semibold text-white">Project Growth Over Time</h6>
                  <div className="text-sm text-gray-200">
                    Tracks the progress and growth rate of different projects
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={generateReport}
                className="bg-[#00192F] rounded-2xl font-bold text-[17px] font-monst text-white py-2 px-6 border-2 border-[#4A9CCD] hover:bg-[#4A9CCD] hover:text-white transition-all duration-300 mb-5"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestorHome;