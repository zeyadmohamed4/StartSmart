import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Rawana from './imgs/Rawana.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faChartLine, faHandshake, faBell, faSignOutAlt, faMagnifyingGlass, faEye, faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function InvestorProjects({ userId }) {
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    role: "Investor",
    profileImage: Rawana,
    name: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const API_BASE_URL = "https://localhost:7010/api/Investment";

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
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded?.role || 'Investor'
      }));

      fetchProfileData(extractedUsername);
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/auth');
    }
  }, [navigate]);

  const fetchProfileData = async (username) => {
    try {
      const response = await fetch(`https://localhost:7010/api/Profile/profile?username=${username}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
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
    }
  };

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/GetAll`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const formattedInvestments = response.data.map(investment => ({
          id: investment.id,
          projectName: investment.projectName || "Unknown",
          investmentAmount: investment.investmentAmount || 0,
          interestRate: investment.interestRate ? `${investment.interestRate}%` : "-",
          revenueShare: investment.revenueShare ? `${investment.revenueShare}%` : "-",
          equityPercentage: investment.equityPercentage ? `${investment.equityPercentage}%` : "-",
          revenue: investment.revenue || "-",
          status: investment.status || "Unknown",
          date: new Date(investment.date).toLocaleDateString() || new Date().toLocaleDateString(),
          investorName: investment.investorName,
          projectDetails: investment.projectDetails,
          category: investment.category
        }));
        
        setInvestments(formattedInvestments);
        setError(null);
      } catch (err) {
        console.error("Error fetching investments:", err);
        setError("Failed to load investments. Please try again later.");
        setInvestments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, [deleteSuccess]);

  const fields = [
    "projectName",
    "investmentAmount",
    "interestRate",
    "revenueShare",
    "equityPercentage",
    "revenue",
    "status",
    "date",
  ];

   const handleLogout = () => {
  localStorage.removeItem("token");
  alert('Your session has been ended');
  navigate("/");
};
  const menuItems = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Profile', path: '/InvestorProfile', icon: faUser },
    { label: 'Dashboard', path: '/InvestorHome', icon: faChartLine },
    { label: 'Notifications', path: '/InvestorNotifications', icon: faBell },
    { label: 'Logout', onClick: handleLogout, icon: faSignOutAlt }, 

  ];

  const handleManageClick = (id) => {
    setActiveProjectId(id === activeProjectId ? null : id);
  };

  const navigateToProjectDetails = (projectId) => {
    setActiveProjectId(null);
    navigate('/ProjectDetails', { 
      state: { projectId } 
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeleteConfirmation(true);
    setActiveProjectId(null);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing');
      }

      await axios.delete(
        `${API_BASE_URL}/DeleteInvestment/${deleteTargetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setInvestments(prev => prev.filter(investment => investment.id !== deleteTargetId));
      setDeleteSuccess(true);
    } catch (err) {
      console.error("Error deleting investment:", err);
      setDeleteError(
        err.response?.data?.message || 
        err.message || 
        'Failed to delete investment. Please try again.'
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      setTimeout(() => {
        setDeleteSuccess(false);
        setDeleteError(null);
      }, 3000);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteTargetId(null);
  };

  const renderTable = () => (
    <div className="bg-gray-50 rounded-xl p-6 w-full overflow-x-auto font-monst text-left">
      {deleteSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          Investment deleted successfully!
        </div>
      )}
      {deleteError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {deleteError}
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      <table className="min-w-full max-w-6xl mx-auto bg-gray-100 text-gray-700 text-sm shadow-lg rounded-lg mb-4">
        <thead className="text-[13px] text-center bg-gray-200">
          <tr className="py-4">
            {fields.map((field) => (
              <th key={field} className="py-2 px-4 border-b capitalize">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </th>
            ))}
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investments
            .filter(investment => investment.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((investment) => (
              <tr key={investment.id} className="text-center">
                {fields.map((field) => (
                  <td key={field} className="py-2 px-4 border-b">
                    {field === 'investmentAmount' ? `$${investment[field]?.toLocaleString()}` : 
                     field === 'date' ? new Date(investment[field]).toLocaleDateString() :
                     investment[field] ?? "-"}
                  </td>
                ))}
                <td className="py-2 px-4 border-b">
                  {activeProjectId !== investment.id ? (
                    <button
                      className="bg-blue-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg"
                      onClick={() => handleManageClick(investment.id)}
                    >
                      Manage
                    </button>
                  ) : (
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                        onClick={() => navigateToProjectDetails(investment.id)}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        View
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                        onClick={() => handleDeleteClick(investment.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="content w-full bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[230px] h-auto py-6 rounded-xl bg-gradient-to-b from-[#00192f] to-[#4A9CCD] text-gray-400 font-semibold shadow-md hidden sm:block sticky top-20">
          <div className="flex flex-col items-center mt-12">
            <img 
              src={userData.profileImage} 
              alt="Investor" 
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
        <div className="bg-gray-50 rounded-xl p-6 shadow-md w-full overflow-x-auto font-monst text-left">
          <h2 className="text-xl font-bold font-monst mb-6 mt-12 text-[#00192f] text-left">
            My Investments Overview
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : investments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No investments found</p>
            </div>
          ) : (
            renderTable()
          )}
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-2">Are you sure you want to delete this investment?</p>
            <p className="text-gray-500 text-sm mb-4">
              Deleting this investment will cost you{" "}
              <span className="font-bold text-red-500">50% of the investment amount</span> for the Company Owner if you have already invested in this project.
            </p>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvestorProjects;