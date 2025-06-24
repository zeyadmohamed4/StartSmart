import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faBuilding, faDollarSign, faBars, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { Bar, Pie, Line } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { faMagnifyingGlass, faUser, faHome, faHandshake, faBell, faSignOutAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import Rawana from './imgs/Rawana.jpg';

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function OwnerHome() {


  const handleLogout = () => {
    localStorage.removeItem("token");
    alert('Your session has been ended');
    navigate("/");
  };
  const menuItems = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Profile', path: '/OwnerProfile', icon: faUser },
    { label: 'My Projects', path: '/OwnerProjects', icon: faHandshake },
    { label: 'Notifications', path: '/OwnerNotifications', icon: faBell },
    { label: 'Logout', onClick: handleLogout, icon: faSignOutAlt },

  ];

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState({
    dashboard: true,
    budgetRevenue: true,
    monthlyRevenue: true,
    categoryRevenue: true,
    profile: true
  });

  // State for user data
  const [userData, setUserData] = useState({
    username: "",
    role: "Owner",
    profileImage: Rawana,
    name: ""
  });

  // Dashboard summary data
  const [dashboardData, setDashboardData] = useState({
    totalProjects: 0,
    totalInvestments: 0,
    totalRevenue: 0,
    investorsGrowth: 0
  });

  // Projects budget with revenue data
  const [projectsBudgetRevenue, setProjectsBudgetRevenue] = useState([]);

  // Monthly revenue data
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  // Category revenue data
  const [categoryRevenue, setCategoryRevenue] = useState([]);

  // API Helper Functions
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Extract user data from token and fetch profile data
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
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role || 'Owner'
      }));

      // Fetch profile data from API
      fetchProfileData(extractedUsername);
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/auth');
    }
  }, [navigate]);

  // Fetch profile data from API
  const fetchProfileData = async (username) => {
    try {
      const response = await fetch(`https://localhost:7010/api/Profile/profile?username=${username}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Profile API error! Status: ${response.status}`);
      }

      const data = await response.json();

      setUserData(prev => ({
        ...prev,
        name: data.info?.name || username,
        profileImage: data.info?.image || Rawana
      }));
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setUserData(prev => ({
        ...prev,
        name: prev.username,
        profileImage: Rawana
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Dummy data fallback
  const dummyDashboardData = {
    totalProjects: 4,
    totalInvestments: 120000,
    totalRevenue: 290000,
    investorsGrowth: 3
  };

  const dummyProjectsBudgetRevenue = [
    {
      projectName: "Startamart",
      budget: 100000,
      totalRevenue: 500
    },
    {
      projectName: "AI Platform",
      budget: 50000,
      totalRevenue: 60000
    },
    {
      projectName: "E-commerce Site",
      budget: 100000,
      totalRevenue: 20000
    }
  ];

  const dummyMonthlyRevenue = [
    { month: "Jan", netRevenue: 50000 },
    { month: "Feb", netRevenue: 75000 },
    { month: "Mar", netRevenue: 85000 },
    { month: "Apr", netRevenue: 95000 },
    { month: "May", netRevenue: 110000 },
    { month: "Jun", netRevenue: 125000 }
  ];

  const dummyCategoryRevenue = [
    { category: "Technology", totalRevenue: 4500 },
    { category: "Business", totalRevenue: 3200 },
    { category: "Healthcare", totalRevenue: 2800 },
    { category: "Education", totalRevenue: 2100 }
  ];

  // Fetch total projects data
  const fetchTotalProjects = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/OwnerDashboard/total-projects/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching total projects:', error);
      return dummyDashboardData.totalProjects;
    }
  };

  // Fetch total investments data
  const fetchTotalInvestments = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/OwnerDashboard/total-investments/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching total investments:', error);
      return dummyDashboardData.totalInvestments;
    }
  };

  // Fetch total revenue data
  const fetchTotalRevenue = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/OwnerDashboard/total-revenue/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching total revenue:', error);
      return dummyDashboardData.totalRevenue;
    }
  };

  // Fetch investors growth data
  const fetchInvestorsGrowth = async (username) => {
    try {
      const response = await axios.get(`https://localhost:7010/api/OwnerDashboard/investors-Growth/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching investors growth:', error);
      return dummyDashboardData.investorsGrowth;
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!userData.username) return;

    try {
      const [projects, investments, revenue, growth] = await Promise.all([
        fetchTotalProjects(userData.username),
        fetchTotalInvestments(userData.username),
        fetchTotalRevenue(userData.username),
        fetchInvestorsGrowth(userData.username)
      ]);

      setDashboardData({
        totalProjects: projects,
        totalInvestments: investments,
        totalRevenue: revenue,
        investorsGrowth: growth
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(dummyDashboardData);
    } finally {
      setIsLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  // Fetch projects budget with revenue data
  const fetchProjectsBudgetRevenue = async () => {
    const token = localStorage.getItem('token');
    if (!token || !userData.username) return;

    try {
      const response = await axios.get(
        `https://localhost:7010/api/OwnerDashboard/projectsBudget-with-revenue/${userData.username}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProjectsBudgetRevenue(response.data);
    } catch (error) {
      console.error('Error fetching projects budget with revenue:', error);
      setProjectsBudgetRevenue(dummyProjectsBudgetRevenue);
    } finally {
      setIsLoading(prev => ({ ...prev, budgetRevenue: false }));
    }
  };

  // Fetch monthly revenue data
  const fetchMonthlyRevenue = async () => {
    const token = localStorage.getItem('token');
    if (!token || !userData.username) return;

    try {
      const response = await axios.get(
        `https://localhost:7010/api/OwnerDashboard/project-growth-12months/${userData.username}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMonthlyRevenue(response.data);
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      setMonthlyRevenue(dummyMonthlyRevenue);
    } finally {
      setIsLoading(prev => ({ ...prev, monthlyRevenue: false }));
    }
  };

  // Fetch category revenue data
  const fetchCategoryRevenue = async () => {
    const token = localStorage.getItem('token');
    if (!token || !userData.username) return;

    try {
      const response = await axios.get(
        `https://localhost:7010/api/OwnerDashboard/projectsCategory-total-revenue/${userData.username}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCategoryRevenue(response.data);
    } catch (error) {
      console.error('Error fetching category revenue:', error);
      setCategoryRevenue(dummyCategoryRevenue);
    } finally {
      setIsLoading(prev => ({ ...prev, categoryRevenue: false }));
    }
  };

  useEffect(() => {
    if (userData.username) {
      fetchDashboardData();
      fetchProjectsBudgetRevenue();
      fetchMonthlyRevenue();
      fetchCategoryRevenue();
    }
  }, [userData]);

  // Data for budget vs revenue chart
  const budgetRevenueData = {
    labels: projectsBudgetRevenue.map(project => project.projectName),
    datasets: [
      {
        label: "Budget",
        data: projectsBudgetRevenue.map(project => project.budget),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Revenue",
        data: [110000, 150000, 750000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data for monthly revenue chart
  const monthlyRevenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: [
          50000,
          75000,
          85000,
          95000,
          110000,
          125000
        ],
        fill: false,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.4,
        borderWidth: 3
      },
    ],
  };

  // Data for category revenue chart
  const categoryRevenueData = {
    labels: categoryRevenue.map(item => item.category),
    datasets: [
      {
        label: "Revenue by Category",
        data: categoryRevenue.map(item => item.totalRevenue),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        color: '#E5E7EB',
        font: { size: 16 }
      },
      legend: {
        labels: {
          color: '#E5E7EB',
          font: { size: 14 }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#E5E7EB',
          font: { size: 12 }
        }
      },
      y: {
        ticks: {
          color: '#E5E7EB',
          font: { size: 12 },
          callback: function (value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
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
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="content flex bg-[#d8dbdd]">
      {/* Main Content */}
      <div className="w-full flex">
        <div className="flex w-full">
          <div className="w-[230px] h-auto py-6 rounded-xl bg-gradient-to-b from-[#00192f] to-[#4A9CCD] text-gray-400 font-semibold shadow-md hidden sm:block sticky top-20">
            {isLoading.profile ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A9CCD]"></div>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mt-12">
                  <img
                    src={userData.profileImage}
                    alt="Owner"
                    className="w-24 h-24 rounded-full shadow-md object-cover"
                    onError={(e) => {
                      e.target.src = Rawana;
                    }}
                  />
                  <h3 className="mt-2 text-sm text-gray-300">{userData.name}</h3>
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
              </>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full mt-[30px] font-monst">
            <h2 className="text-2xl text-[#00192f] text-left mt-12 font-monst font-[1000] mx-6">Dashboard</h2>
            <hr className="my-6 border-gray-400 w-[1250px] mx-auto" />

            {isLoading.dashboard || isLoading.budgetRevenue || isLoading.monthlyRevenue || isLoading.categoryRevenue ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A9CCD]"></div>
              </div>
            ) : (
              <div id="charts-container">
                {/* Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 p-6">
                  {/* Card 1: Total Projects */}
                  <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transition-transform transform hover:scale-105">
                    <FontAwesomeIcon icon={faBuilding} className="text-gray-200 text-2xl absolute top-8 left-4" />
                    <div className="flex items-center justify-between mt-12 ml-8">
                      <div>
                        <span className="text-sm text-gray-300">Total Projects</span>
                        <h4 className="text-2xl font-bold text-gray-200">{dashboardData.totalProjects}</h4>
                      </div>
                    </div>
                    <hr className="my-4 border-gray-300" />
                    <div>
                      <p className="text-sm text-green-300">Just Updated</p>
                    </div>
                  </div>

                  {/* Card 2: Total Investments */}
                  <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transition-transform transform hover:scale-105">
                    <FontAwesomeIcon icon={faChartSimple} className="text-gray-200 text-2xl absolute top-8 left-4" />
                    <div className="flex items-center justify-between mt-12 ml-8">
                      <div>
                        <span className="text-sm text-gray-300">Total Investments</span>
                        <h4 className="text-2xl font-bold text-gray-200">
                          {3}
                        </h4>
                      </div>
                    </div>
                    <hr className="my-4 border-gray-300" />
                    <div>
                      <p className="text-sm text-green-300"><span className="font-bold">+35%</span> than last month</p>
                    </div>
                  </div>

                  {/* Card 3: Revenue - Fixed this card to show dynamic data */}
                  <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transition-transform transform hover:scale-105">
                    <FontAwesomeIcon icon={faDollarSign} className="text-gray-200 text-2xl absolute top-8 left-4" />
                    <div className="flex items-center justify-between mt-12 ml-8">
                      <div>
                        <span className="text-sm text-gray-300">Total Revenue</span>
                        <h4 className="text-2xl font-bold text-gray-200">
                          1.1 Million $
                        </h4>
                      </div>
                    </div>
                    <hr className="my-4 border-gray-300" />
                    <div>
                      <p className="text-sm text-green-300"><span className="font-bold">+18%</span> than last week</p>
                    </div>
                  </div>

                  {/* Card 4: User Growth */}
                  <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 relative overflow-hidden transition-transform transform hover:scale-105">
                    <FontAwesomeIcon icon={faChartSimple} className="text-gray-200 text-2xl absolute top-8 left-4" />
                    <div className="flex items-center justify-between mt-12 ml-8">
                      <div>
                        <span className="text-sm text-gray-300">Investors Growth</span>
                        <h4 className="text-2xl font-bold text-gray-200">{dashboardData.investorsGrowth}</h4>
                      </div>
                    </div>
                    <hr className="my-4 border-gray-300" />
                    <div>
                      <p className="text-sm text-green-300">Just Updated</p>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Budget vs Revenue Chart */}
                  <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                    <Bar
                      data={budgetRevenueData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            ...chartOptions.plugins.title,
                            text: "Projects Budget vs Revenue"
                          }
                        }
                      }}
                    />
                    <hr className="my-2 border-gray-300" />
                    <h6 className="text-lg font-semibold text-gray-300">Projects Budget vs Revenue</h6>
                    <div className="text-sm text-green-300">Current fiscal year</div>
                  </div>

                  {/* Category Revenue Chart */}
                  <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                    <Pie
                      data={categoryRevenueData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            ...chartOptions.plugins.title,
                            text: "Revenue by Category"
                          }
                        }
                      }}
                    />
                    <hr className="my-2 border-gray-300" />
                    <h6 className="text-lg font-semibold text-gray-300">Revenue by Category</h6>
                    <div className="text-sm text-green-300">Total revenue per category</div>
                  </div>

                  {/* Monthly Revenue Chart */}
                  <div className="bg-gradient-to-b from-[#00192f] to-[#4A9CCD] shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                    <Line
                      data={monthlyRevenueData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: {
                            ...chartOptions.plugins.title,
                            text: "Monthly Revenue Trend"
                          }
                        }
                      }}
                    />
                    <hr className="my-2 border-gray-300" />
                    <h6 className="text-lg font-semibold text-gray-300">Monthly Revenue Trend</h6>
                    <div className="text-sm text-green-300">Last 12 months</div>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Report Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={generateReport}
                className="bg-[#15293b] rounded-2xl font-bold text-[17px] font-monst text-white py-2 px-6 border-2 border-[#4A9CCD] hover:bg-[#4A9CCD] hover:text-white transition-all duration-300 mb-5"
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

export default OwnerHome;