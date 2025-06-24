import React, { useState, useEffect } from "react";
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import Rawana from './imgs/Rawana.jpg';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';
import {
  faMagnifyingGlass,
  faUser,
  faHome,
  faChartLine,
  faHandshake,
  faBell,
  faSignOutAlt,
  faEye,
  faTrash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from "jwt-decode";

function OwnerProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // State for user data
  const [userData, setUserData] = useState({
    username: "",
    role: "Owner",
    profileImage: Rawana,
    name: ""
  });

  // Define table columns
  const columns = [
    { key: 'projectName', display: 'Project Name' },
    { key: 'status', display: 'Status' },
    { key: 'totalFundingRounds', display: 'Funding Rounds' },
    { key: 'totalMilestones', display: 'Milestones' },
    { key: 'mileStoneYear', display: 'Milestone Year' },
    { key: 'totalPartenerships', display: 'Partnerships' },
    { key: 'fundingAmount', display: 'Funding Amount' },
    { key: 'noOfInvestors', display: 'Investors' },
    { key: 'fundAmountRaised', display: 'Amount Raised' },
    { key: 'foundingYear', display: 'Founded' },
    { key: 'fundingYear', display: 'Funding Year' },
    { key: 'fundingFundYear', display: 'Fund Year' },
    { key: 'averageFundingPerRound', display: 'Avg Funding' },
    { key: 'firstFundedAt', display: 'First Funded' },
    { key: 'category', display: 'Category' },
    { key: 'location', display: 'Location' },
    { key: 'country', display: 'Country' },
    { key: 'isActiveTill', display: 'Active Till' },
    { key: 'campaignDealType', display: 'Deal Type' },
    { key: 'fundingRoundType', display: 'Round Type' },
    { key: 'totalFundingRecieved', display: 'Total Funding' },
    { key: 'companyAge', display: 'Company Age' },
    { key: 'funding_Source', display: 'Funding Source' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert('Your session has been ended');
    navigate("/");
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Profile', path: '/OwnerProfile', icon: faUser },
    { label: 'Dashboard', path: '/OwnerHome', icon: faChartLine },
    { label: 'Notifications', path: '/OwnerNotifications', icon: faBell },
    { label: 'Logout', onClick: handleLogout, icon: faSignOutAlt },
  ];

  const currentPath = location.pathname;

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
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7010/api/Project/GetByUserName', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const transformedProjects = response.data.map(project => ({
          Id: project.id || project.Id, // Ensure consistent ID mapping
          projectName: project.projectName,
          status: project.status || 'Active',
          totalFundingRounds: project.totalFundingRounds || 0,
          totalMilestones: project.totalMilestones || 0,
          mileStoneYear: project.mileStoneYear || project.foundingYear || 0,
          totalPartenerships: project.totalPartenerships || 0,
          fundingAmount: project.fundingAmount ? `$${project.fundingAmount.toLocaleString()}` : '$0',
          noOfInvestors: project.noOfInvestors || 0,
          fundAmountRaised: project.fundAmountRaised ? `$${project.fundAmountRaised.toLocaleString()}` : '$0',
          foundingYear: project.foundingYear || 'N/A',
          fundingYear: project.fundingYear || 'N/A',
          fundingFundYear: project.fundingFundYear || 'N/A',
          averageFundingPerRound: project.averageFundingPerRound ? `$${project.averageFundingPerRound.toLocaleString()}` : '$0',
          firstFundedAt: project.firstFundedAt ? new Date(project.firstFundedAt).toLocaleDateString() : 'N/A',
          category: project.category || 'N/A',
          location: project.location || 'N/A',
          country: project.country || 'N/A',
          isActiveTill: project.isActiveTill ? new Date(project.isActiveTill).toLocaleDateString() : 'N/A',
          campaignDealType: project.campaignDealType || 'N/A',
          fundingRoundType: project.fundingRoundType || 'N/A',
          totalFundingRecieved: project.totalFundingRecieved ? `$${project.totalFundingRecieved.toLocaleString()}` : '$0',
          companyAge: project.companyAge || (project.foundingYear ? new Date().getFullYear() - project.foundingYear : 'N/A'),
          funding_Source: project.funding_Source || 'N/A',
          createdAt: project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A',
          budget: project.budget ? `$${project.budget.toLocaleString()}` : '$0',
          photo: project.photo || ''
        }));

        setProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [deleteSuccess]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigateToProjectDetails = (projectId) => {
    setActiveProjectId(null);
    navigate('/ProjectDetails', {
      state: { projectId }
    });
  };

  const handleManageClick = (Id) => {
    setActiveProjectId(Id === activeProjectId ? null : Id);
  };

  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
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
        `https://localhost:7010/api/Project/Delete/${projectToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setProjects(prevProjects =>
        prevProjects.filter(project => project.Id !== projectToDelete)
      );

      setDeleteSuccess(true);
    } catch (error) {
      console.error('Error deleting project:', error);
      setDeleteError(
        error.response?.data?.message ||
        error.message ||
        'Failed to delete project. Please try again.'
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
    setProjectToDelete(null);
  };
  const handleViewDetails = (project) => {
    navigate('/ProjectDetails', {
      state: {
        ProjectId: project.Id,

      }
    });
  };
  const renderTable = () => (
    <div className="bg-gray-50 rounded-xl p-6 w-full overflow-x-auto font-monst text-left">
      {/* Success/Error Messages */}
      {deleteSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          Project deleted successfully!
        </div>
      )}
      {deleteError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {deleteError}
        </div>
      )}

      <table className="min-w-full max-w-6xl mx-auto bg-gray-100 text-gray-700 text-sm shadow-lg rounded-lg mb-4">
        <thead className="text-[13px] text-center bg-gray-200">
          <tr className="py-4">
            {columns.map((column) => (
              <th key={column.key} className="py-2 px-4 border-b">
                {column.display}
              </th>
            ))}
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.Id} className="text-center">
              {columns.map((column) => (
                <td key={`${project.Id}-${column.key}`} className="py-2 px-4 border-b">
                  {project[column.key] || 'N/A'}
                </td>
              ))}
              <td className="py-2 px-4 border-b">
                {activeProjectId !== project.Id ? (
                  <button
                    className="bg-blue-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg"
                    onClick={() => handleManageClick(project.Id)}
                  >
                    Manage
                  </button>
                ) : (
                  <div className="flex justify-center space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                      onClick={() => handleViewDetails(project)}
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-2" />
                      View
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                      onClick={() => handleDeleteClick(project.Id)}
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
    <div className="content w-full flex bg-gray-50 font-monst">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-2">Are you sure you want to delete this project?</p>
            <p className="text-gray-500 text-sm mb-4">This action cannot be undone.</p>

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

      <div className="flex w-full">
        {/* Sidebar */}
        <div className="w-[230px] h-auto py-6 rounded-xl bg-gradient-to-b from-[#00192f] to-[#4A9CCD] text-gray-400 font-semibold shadow-md hidden sm:block sticky top-20">
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
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-md w-full overflow-x-auto font-monst text-left">
          <h2 className="text-xl font-bold font-monst mb-6 mt-12 text-[#00192f] text-left">
            My Projects
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No projects found</p>
            </div>
          ) : (
            renderTable()
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerProjects;