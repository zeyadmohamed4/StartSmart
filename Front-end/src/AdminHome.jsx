import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  faMagnifyingGlass,
  faHome,
  faSignOutAlt,
  faChartLine,
  faUsers,
  faChevronDown,
  faChevronUp,
  faUserTie,
  faHourglassHalf,
  faProjectDiagram,
  faBuilding,
  faChartSimple,
  faDollarSign,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bar, Pie } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Rawana from './imgs/zoz.jpg';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AdminHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [pendingDropdownOpen, setPendingDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    websiteVisits: [],
    projectsByLocation: [],
    projectsByCountry: {},
    fundingVsBudget: [],
    userCounts: { ownersCount: 0, investorsCount: 0 },
    totalProjects: 0,
    totalInvestments: 0,
    totalRevenue: 0,
    userGrowth: 0
  });

  // State for user data from token
  const [userData, setUserData] = useState({
    username: "",
    role: "Admin",
    profileImage: Rawana
  });

  // Enhanced dummy data with monthly breakdowns and realistic growth
  const dummyData = {
    stats: {
      totalProjects: {
        current: 342,
        monthlyGrowth: [250, 270, 290, 310, 330, 342],
        percentageChange: 12.5
      },
      totalInvestments: {
        current: 420000,
        monthlyGrowth: [300000, 330000, 360000, 390000, 405000, 420000],
        percentageChange: 15.8
      },
      totalRevenue: {
        current: 125000,
        monthlyGrowth: [80000, 90000, 100000, 110000, 120000, 125000],
        percentageChange: 22.7
      },
      userGrowth: {
        current: 528,
        monthlyGrowth: [350, 400, 450, 480, 500, 528],
        percentageChange: 18.3
      }
    },
    websiteVisits: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [150, 200, 180, 220, 270, 300]
    },
    projectsByLocation: {
      labels: ["New York", "San Francisco", "Los Angeles", "Chicago", "Houston"],
      data: [15, 10, 18, 12, 8]
    },
    projectsByCountry: {
      "Australia": 2,
      "Brazil": 4,
      "Canada": 2,
      "China": 2
    },
    fundingVsBudget: {
      labels: ["Project A", "Project B", "Project C", "Project D", "Project E"],
      budget: [60000, 80000, 75000, 95000, 70000],
      funding: [55000, 65000, 70000, 90000, 60000]
    },
    userCounts: {
      ownersCount: 3,
      investorsCount: 2
    },
    totalProjects: 342,
    totalInvestments: 420000,
    totalRevenue: 125000,
    userGrowth: 528
  };

  // Extract user data from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserData({
        username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded?.username || 'Admin',
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role || 'Admin',
        profileImage: decoded.image || Rawana
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/auth');
    }
  }, [navigate]);

  // API endpoints configuration
  const API_ENDPOINTS = {
    stats: '/api/admin/stats',
    websiteVisits: '/api/admin/website-visits',
    projectsByLocation: '/api/admin/projects-by-location',
    projectsByCountry: 'https://localhost:7010/api/AdminDashboard/projects-by-country',
    fundingVsBudget: 'https://localhost:7010/api/AdminDashboard/projects-funding-info',
    userCounts: 'https://localhost:7010/api/AdminDashboard/total-owners-investors',
    totalProjects: 'https://localhost:7010/api/AdminDashboard/total-projects',
    totalInvestments: 'https://localhost:7010/api/AdminDashboard/total-investments',
    totalRevenue: 'https://localhost:7010/api/AdminDashboard/total-revenue',
    userGrowth: 'https://localhost:7010/api/AdminDashboard/user-growth'
  };

  // Enhanced fetch function with better error handling
  const fetchData = async (endpoint, fallbackData) => {
    try {
      const response = await axios.get(endpoint);
      return response.data || fallbackData;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return fallbackData;
    }
  };

  // Process funding vs budget data from API
  const processFundingData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return dummyData.fundingVsBudget;

    const labels = [];
    const budget = [];
    const funding = [];

    apiData.forEach(project => {
      labels.push(project.projectName);
      budget.push(project.budget);
      funding.push(project.totalFundingRecieved);
    });

    return {
      labels,
      budget,
      funding
    };
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        statsData,
        websiteVisitsData,
        projectsByLocationData,
        projectsByCountryData,
        fundingVsBudgetData,
        userCountsData,
        totalProjectsData,
        totalInvestmentsData,
        totalRevenueData,
        userGrowthData
      ] = await Promise.all([
        fetchData(API_ENDPOINTS.stats, dummyData.stats),
        fetchData(API_ENDPOINTS.websiteVisits, dummyData.websiteVisits),
        fetchData(API_ENDPOINTS.projectsByLocation, dummyData.projectsByLocation),
        fetchData(API_ENDPOINTS.projectsByCountry, dummyData.projectsByCountry),
        fetchData(API_ENDPOINTS.fundingVsBudget, []).then(data => processFundingData(data)),
        fetchData(API_ENDPOINTS.userCounts, dummyData.userCounts),
        fetchData(API_ENDPOINTS.totalProjects, dummyData.totalProjects),
        fetchData(API_ENDPOINTS.totalInvestments, dummyData.totalInvestments),
        fetchData(API_ENDPOINTS.totalRevenue, dummyData.totalRevenue),
        fetchData(API_ENDPOINTS.userGrowth, dummyData.userGrowth)
      ]);

      setDashboardData({
        stats: statsData,
        websiteVisits: websiteVisitsData,
        projectsByLocation: projectsByLocationData,
        projectsByCountry: projectsByCountryData,
        fundingVsBudget: fundingVsBudgetData,
        userCounts: userCountsData,
        totalProjects: totalProjectsData,
        totalInvestments: totalInvestmentsData,
        totalRevenue: totalRevenueData,
        userGrowth: userGrowthData
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Showing sample data instead.");
      setDashboardData(dummyData);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    // Convert projectsByCountry object to chart format
    const countriesData = dashboardData.projectsByCountry || dummyData.projectsByCountry;
    const countryLabels = Object.keys(countriesData);
    const countryValues = Object.values(countriesData);

    // Prepare user diversity data from userCounts
    const userCounts = dashboardData.userCounts || dummyData.userCounts;
    const userDiversityLabels = ["Owners", "Investors"];
    const userDiversityData = [userCounts.ownersCount, userCounts.investorsCount];

    return {
      websiteVisits: {
        labels: dashboardData.websiteVisits?.labels || dummyData.websiteVisits.labels,
        datasets: [
          {
            label: "Website Visits",
            data: dashboardData.websiteVisits?.data || dummyData.websiteVisits.data,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      projectsByLocation: {
        labels: dashboardData.projectsByLocation?.labels || dummyData.projectsByLocation.labels,
        datasets: [
          {
            label: "Number of Projects",
            data: dashboardData.projectsByLocation?.data || dummyData.projectsByLocation.data,
            backgroundColor: [
              "rgba(255, 205, 86, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 99, 132, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)"
            ],
            borderColor: [
              "rgba(255, 205, 86, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)"
            ],
            borderWidth: 1,
          },
        ],
      },
      projectsByCountry: {
        labels: countryLabels,
        datasets: [
          {
            label: "Projects by Country",
            data: countryValues,
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)"
            ],
            borderWidth: 1,
          },
        ],
      },
      fundingVsBudget: {
        labels: dashboardData.fundingVsBudget?.labels || dummyData.fundingVsBudget.labels,
        datasets: [
          {
            label: "Budget",
            data: dashboardData.fundingVsBudget?.budget || dummyData.fundingVsBudget.budget,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Funding Received",
            data: dashboardData.fundingVsBudget?.funding || dummyData.fundingVsBudget.funding,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
      userDiversity: {
        labels: userDiversityLabels,
        datasets: [
          {
            label: "User Types",
            data: userDiversityData,
            backgroundColor: [
              "rgba(255, 159, 64, 0.8)",
              "rgba(75, 192, 192, 0.8)"
            ],
            borderWidth: 1,
          },
        ],
      }
    };
  };

  const chartData = prepareChartData();

  // Enhanced chart options with larger fonts and better visibility
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Performance Metrics",
        color: "#FFFFFF",
        font: {
          size: 18
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      legend: {
        position: 'top',
        labels: {
          color: "#FFFFFF",
          padding: 20,
          boxWidth: 15,
          font: {
            size: 14
          }
        },
      },
      tooltip: {
        bodyColor: "#FFFFFF",
        titleColor: "#FFFFFF",
        padding: 12,
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 16
        }
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#FFFFFF",
          padding: 10,
          font: {
            size: 12
          }
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#FFFFFF",
          padding: 10,
          font: {
            size: 12
          }
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        beginAtZero: true
      },
    },
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const chartsDiv = document.getElementById("charts-container");

    html2canvas(chartsDiv).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 10, 180, 160);
      doc.save("dashboard-report.pdf");
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="content flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-[230px] h-auto py-6 rounded-xl bg-gradient-to-b from-[#00192f] to-[#4A9CCD] text-gray-400 font-semibold shadow-md hidden sm:block sticky top-20">
        <div className="flex flex-col items-center mt-12">
          <img src={userData.profileImage} alt="Admin" className="w-24 h-24 rounded-full shadow-md" />
          <h3 className="mt-2 text-sm text-gray-300">{userData.username}</h3>
          <p className="text-xs text-gray-400">{userData.role}</p>
          <div className="flex items-center py-[5px] mt-6 border-cyan-900 border-2 rounded-full w-full md:w-[200px] px-8 mx-2">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-300 mr-2 text-sm" />
            <input type="text" placeholder="Search" className="w-full text-white bg-transparent outline-none text-lg placeholder-gray-300" />
          </div>
        </div>

        <ul className="mt-6 space-y-2 mx-4 text-[18px] font-monst">
          <li>
            <a href="/" className={`flex items-center py-2 px-4 rounded-lg transition-colors ${currentPath === '/' ? 'bg-gray-400 text-white' : 'text-gray-400 hover:bg-gray-400 hover:text-white'}`}>
              <FontAwesomeIcon icon={faHome} className="mr-3 text-sm" /> Home
            </a>
          </li>
          <li>
            <a href="/AdminHome" className={`flex items-center py-2 px-4 rounded-lg transition-colors ${currentPath === '/AdminHome' ? 'bg-gray-400 text-white' : 'text-gray-400 hover:bg-gray-400 hover:text-white'}`}>
              <FontAwesomeIcon icon={faChartLine} className="mr-3 text-sm" /> Dashboard
            </a>
          </li>
          <li>
            <button onClick={() => setUsersDropdownOpen(!usersDropdownOpen)} className="flex items-center w-full py-2 px-4 rounded-lg hover:bg-gray-400 hover:text-white text-sm text-left">
              <FontAwesomeIcon icon={faUsers} className="mr-3 text-sm" /> Users Info
              <FontAwesomeIcon icon={usersDropdownOpen ? faChevronUp : faChevronDown} className="ml-auto" />
            </button>
            {usersDropdownOpen && (
              <ul className="ml-6 mt-2 space-y-1 text-sm">
                <li><a href="/AllUsersInfo" className={`block py-1 px-2 rounded ${currentPath === '/AllUsersInfo' ? 'bg-gray-400 text-white' : 'hover:bg-gray-500 text-gray-300'}`}>View All Users</a></li>
                <li><a href="/OwnersInfo" className={`block py-1 px-2 rounded ${currentPath === '/OwnersInfo' ? 'bg-gray-400 text-white' : 'hover:bg-gray-500 text-gray-300'}`}>Project Owners</a></li>
                <li><a href="/InvestorsInfo" className={`block py-1 px-2 rounded ${currentPath === '/InvestorsInfo' ? 'bg-gray-400 text-white' : 'hover:bg-gray-500 text-gray-300'}`}>Investors</a></li>
              </ul>
            )}
          </li>
          <li>
            <button onClick={() => setPendingDropdownOpen(!pendingDropdownOpen)} className="flex items-center w-full py-2 px-4 rounded-lg hover:bg-gray-400 hover:text-white text-sm text-left">
              <FontAwesomeIcon icon={faHourglassHalf} className="mr-3 text-sm" /> Pending
              <FontAwesomeIcon icon={pendingDropdownOpen ? faChevronUp : faChevronDown} className="ml-auto" />
            </button>
            {pendingDropdownOpen && (
              <ul className="ml-6 mt-2 space-y-1 text-sm">
                <li><a href="/PendingProjectsPredictions" className={`block py-1 px-2 rounded ${currentPath === '/PendingProjectsPredictions' ? 'bg-gray-400 text-white' : 'hover:bg-gray-500 text-gray-300'}`}>Pending Projects</a></li>
                <li><a href="/PendingInvestments" className={`block py-1 px-2 rounded ${currentPath === '/PendingInvestments' ? 'bg-gray-400 text-white' : 'hover:bg-gray-500 text-gray-300'}`}>Pending Investments</a></li>
                <li><a href="/PendingUsers" className={`block py-1 px-2 rounded ${currentPath === '/PendingUsers' ? 'bg-gray-400 text-white' : 'hover:bg-gray-500 text-gray-300'}`}>Pending Users</a></li>
              </ul>
            )}
          </li>
          <li>
            <a href="/"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem("token");
                navigate("/");
              }} className={`flex items-center py-2 px-4 rounded-lg transition-colors ${currentPath === '/' ? 'bg-gray-400 text-white' : 'text-gray-400 hover:bg-gray-400 hover:text-white'}`}>
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-sm" /> Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full mt-[30px] font-monst pl-4 pr-6">
        <h2 className="text-2xl  text-[#00192f] text-left mt-12 font-monst font-[1000] mx-6">Dashboard</h2>
        <hr className="my-6 border-gray-400 w-full mx-auto" />

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00192f]"></div>
            <p className="mt-2 text-[#00192f]">Loading dashboard data...</p>
          </div>
        )}

        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 mx-6">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && (
          <div id="charts-container">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transform transition duration-300 hover:scale-105 hover:translate-y-1">
                <FontAwesomeIcon icon={faBuilding} className="text-gray-200 text-2xl absolute top-8 left-4" />
                <div className="flex items-center justify-between mt-12 ml-8">
                  <div>
                    <span className="text-sm text-gray-300">Total Projects</span>
                    <h4 className="text-2xl font-bold text-gray-200">{dashboardData.totalProjects || 0}</h4>
                  </div>
                </div>
                <hr className="my-4 border-gray-300" />
                <p className="text-sm text-green-300">
                  <span className="font-bold">+{dashboardData.stats.totalProjects?.percentageChange || 55}%</span> than last month
                </p>
              </div>

              <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transform transition duration-300 hover:scale-105 hover:translate-y-1">
                <FontAwesomeIcon icon={faChartSimple} className="text-gray-200 text-2xl absolute top-8 left-4" />
                <div className="flex items-center justify-between mt-12 ml-8">
                  <div>
                    <span className="text-sm text-gray-300">Total Investments</span>
                    <h4 className="text-2xl font-bold text-gray-200">
                      {dashboardData.totalInvestments ? dashboardData.totalInvestments.toLocaleString() : 0}
                    </h4>
                  </div>
                </div>
                <hr className="my-4 border-gray-300" />
                <p className="text-sm text-green-300">
                  <span className="font-bold">+{dashboardData.stats.totalInvestments?.percentageChange || 35}%</span> than last month
                </p>
              </div>

              <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transform transition duration-300 hover:scale-105 hover:translate-y-1">
                <FontAwesomeIcon icon={faDollarSign} className="text-gray-200 text-2xl absolute top-8 left-4" />
                <div className="flex items-center justify-between mt-12 ml-8">
                  <div>
                    <span className="text-sm text-gray-300">Total Revenue</span>
                    <h4 className="text-2xl font-bold text-gray-200">
                      {dashboardData.totalRevenue ? dashboardData.totalRevenue.toLocaleString() : 0}
                    </h4>
                  </div>
                </div>
                <hr className="my-4 border-gray-300" />
                <p className="text-sm text-green-300">
                  <span className="font-bold">+{dashboardData.stats.totalRevenue?.percentageChange || 22}%</span> than last month
                </p>
              </div>

              <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transform transition duration-300 hover:scale-105 hover:translate-y-1">
                <FontAwesomeIcon icon={faUsers} className="text-gray-200 text-2xl absolute top-8 left-4" />
                <div className="flex items-center justify-between mt-12 ml-8">
                  <div>
                    <span className="text-sm text-gray-300">User Growth</span>
                    <h4 className="text-2xl font-bold text-gray-200">
                      {dashboardData.userGrowth || 0}
                    </h4>
                  </div>
                </div>
                <hr className="my-4 border-gray-300" />
                <p className="text-sm text-green-300">
                  <span className="font-bold">+{dashboardData.stats.userGrowth?.percentageChange || 18}%</span> than last month
                </p>
              </div>
            </div>

            {/* Charts Section - Made larger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Projects by Country - New chart */}
              <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:translate-y-1 h-[450px] flex flex-col">
                <div className="flex-grow relative p-4">
                  <Bar
                    data={chartData.projectsByCountry}
                    options={{
                      ...options,
                      plugins: {
                        ...options.plugins,
                        title: {
                          ...options.plugins.title,
                          text: "Projects by Country"
                        }
                      }
                    }}
                  />
                </div>
                <hr className="my-2 border-gray-300" />
                <h6 className="text-lg font-semibold text-white px-4">Projects by Country</h6>
                <div className="text-sm text-green-300 px-4 pb-2">Updated: {new Date().toLocaleDateString()}</div>
              </div>

              {/* Updated User Diversity Chart */}
              <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:translate-y-1 h-[450px] flex flex-col">
                <div className="flex-grow relative p-4">
                  <Pie
                    data={chartData.userDiversity}
                    options={{
                      ...options,
                      plugins: {
                        ...options.plugins,
                        title: {
                          ...options.plugins.title,
                          text: "User Distribution"
                        }
                      }
                    }}
                  />
                </div>
                <hr className="my-2 border-gray-300" />
                <h6 className="text-lg font-semibold text-white px-4">User Distribution</h6>
                <div className="text-sm text-green-300 px-4 pb-2">
                  Owners: {dashboardData.userCounts?.ownersCount || 0} |
                  Investors: {dashboardData.userCounts?.investorsCount || 0}
                </div>
              </div>

              {/* Funding vs Budget - Larger */}
              <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:translate-y-1 h-[450px] flex flex-col font-monst">
                <div className="flex-grow relative p-4">
                  <Bar
                    data={chartData.fundingVsBudget}
                    options={{
                      ...options,
                      plugins: {
                        ...options.plugins,
                        title: {
                          ...options.plugins.title,
                          text: "Funding vs Budget"
                        }
                      }
                    }}
                  />
                </div>
                <hr className="my-2 border-gray-300" />
                <h6 className="text-lg font-semibold text-white px-4">Funding Performance</h6>
                <div className="text-sm text-green-300 px-4 pb-2">Updated: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6 mb-10">
          <button
            onClick={generateReport}
            className="bg-[#00192F] rounded-2xl font-bold text-[17px] font-monst text-white py-2 px-6 border-2 border-[#4A9CCD] hover:bg-[#4A9CCD] hover:text-white transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Preparing Data...' : 'Generate Report'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;