import { useState, useEffect } from 'react';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import defaultProfileImage from './imgs/Rawana.jpg';
import project from './imgs/project.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios'; // أضفنا استيراد axios

import {
  faMagnifyingGlass,
  faUser,
  faHome,
  faChartLine,
  faHandshake,
  faBell,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts';

const OwnerProfile = () => {
  const navigate = useNavigate();
  const [isEditingBackground, setIsEditingBackground] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [profileData, setProfileData] = useState({
    UserName: "",
    Role: "",
    Email: "",
    Phone: "",
    Location: "",
    Experience: "",
    Education: "",
    PreviousVentures: "",
    Projects: 0,
    Ranks: 0,
    LinkedIn: "",
    Image: ""
  });
  const [projects, setProjects] = useState([]);
  const [username, setUsername] = useState("");
  // أضفنا متغيرات الحالة المطلوبة
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert('Your session has been ended');
    navigate("/");
  };
  const menuItems = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Dashboard', path: '/OwnerHome', icon: faChartLine },
    { label: 'My Projects', path: '/OwnerProjects', icon: faHandshake },
    { label: 'Notifications', path: '/OwnerNotifications', icon: faBell },
    { label: 'Logout', onClick: handleLogout, icon: faSignOutAlt },

  ];

  const location = useLocation();
  const currentPath = location.pathname;

  const data = [
    { name: '2020', value: 30 },
    { name: '2021', value: 45 },
    { name: '2022', value: 60 },
    { name: '2023', value: 80 },
    { name: '2024', value: 95 },
  ];

  const [editedBackgroundData, setEditedBackgroundData] = useState(profileData);

  // Extract username from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const extractedUsername = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded?.username || 'User';
      setUsername(extractedUsername);
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/auth');
    }
  }, [navigate]);

  // API Helper Functions
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      const profileResponse = await fetch(`https://localhost:7010/api/Profile/profile?username=${username}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!profileResponse.ok) {
        throw new Error(`Profile API error! Status: ${profileResponse.status}`);
      }

      const profileApiData = await profileResponse.json();

      const basicInfoResponse = await fetch(`https://localhost:7010/api/Profile/basicInfo?username=${username}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!basicInfoResponse.ok) {
        throw new Error(`Basic Info API error! Status: ${basicInfoResponse.status}`);
      }

      const basicInfoData = await basicInfoResponse.json();

      const transformedData = {
        UserName: profileApiData.info?.name || "",
        Role: profileApiData.info?.role || "",
        Email: basicInfoData.info?.email || "",
        Phone: profileApiData.info?.phoneNumber || basicInfoData.info?.phone || "",
        Location: basicInfoData.info?.location || "",
        Experience: basicInfoData.info?.experience || "",
        Education: basicInfoData.info?.education || "",
        PreviousVentures: basicInfoData.info?.previousVentures || "",
        Projects: profileApiData.info?.projects || 0,
        Ranks: Math.floor(Math.random() * 34) + 25,
        LinkedIn: basicInfoData.info?.linkedIn || "",
        Image: profileApiData.info?.image || ""
      };

      setIsOwner(profileApiData.info?.role === "Owner");
      setProfileData(transformedData);
      setEditedBackgroundData(transformedData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      const dummyData = {
        UserName: username || "AyaAboud",
        Role: "Owner",
        Email: "ayaaboud@gmail.com",
        Phone: "01099747257",
        Location: "EG ,Cairo",
        Experience: null,
        Education: null,
        PreviousVentures: null,
        Projects: 6,
        Ranks: Math.floor(Math.random() * 34) + 25,
        LinkedIn: "https://www.linkedin.com/in/zeyad-mohamed-13a554238/",
        Image: null
      };

      setIsOwner(true);
      setProfileData(dummyData);
      setEditedBackgroundData(dummyData);
    }
  };

  // Fetch projects using the new API endpoint
  const fetchProjects = async () => {
    try {
      const response = await fetch(`https://localhost:7010/api/Project/GetByUserName?username=${username}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const transformedProjects = data.map(project => ({
        id: project.id, // Changed from ProjectId to id to match the API response
        ProjectName: project.projectName,
        Category: project.category.replace("_", " "),
        ProjectDetails: project.projectDetails || "No description available",
        ProjectPhoto: project.photo || defaultProfileImage,
        InvestmentStatus: project.investmentStatus
      }));

      setProjects(transformedProjects);
      setProfileData(prev => ({
        ...prev,
        Projects: data.length
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([
        {
          id: 1, // Changed from ProjectId to id
          ProjectName: "Tech Innovators",
          Category: "Art Design",
          ProjectDetails: "My project description",
          ProjectPhoto: project,
          InvestmentStatus: "Approved"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchProfileData();
      fetchProjects();
      window.scrollTo(0, 0);
    }
  }, [username]);

  const handleChangeBackground = (e) => {
    const { name, value } = e.target;
    setEditedBackgroundData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditBackgroundClick = () => setIsEditingBackground(true);

  const handleSaveBackground = async () => {
    try {
      const response = await fetch(`https://localhost:7010/api/Users/Create-professional-info?userName=${username}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          experience: editedBackgroundData.Experience,
          education: editedBackgroundData.Education,
          previousVenture: editedBackgroundData.PreviousVentures
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedData = await response.json();

      setProfileData(prev => ({
        ...prev,
        Experience: updatedData.data.experience || editedBackgroundData.Experience,
        Education: updatedData.data.education || editedBackgroundData.Education,
        PreviousVentures: updatedData.data.previousVenture || editedBackgroundData.PreviousVentures
      }));

      setEditedBackgroundData(prev => ({
        ...prev,
        Experience: updatedData.data.experience || editedBackgroundData.Experience,
        Education: updatedData.data.education || editedBackgroundData.Education,
        PreviousVentures: updatedData.data.previousVenture || editedBackgroundData.PreviousVentures
      }));

      setIsEditingBackground(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + error.message);
    }
  };

  const handleCancelEditBackground = () => {
    setEditedBackgroundData(profileData);
    setIsEditingBackground(false);
  };

  const navigateToProjectDetails = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    navigate('/ProjectDetails', {
      state: {
        projectId: projectId,
        projectData: project
      }
    });
  };

  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeleteConfirmation(true);
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
        prevProjects.filter(project => project.id !== projectToDelete)
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex content bg-gray-50">
      <div className="w-full flex">
        {/* Sidebar */}
        <div className="w-[230px] py-6 rounded-xl bg-gradient-to-b from-[#00192f] to-[#4A9CCD] text-gray-400 font-semibold shadow-md hidden sm:block sticky top-20">
          <div className="flex flex-col items-center mt-12">
            <img
              src={profileData.Image || defaultProfileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md object-cover"
              onError={(e) => {
                e.target.src = defaultProfileImage;
              }}
            />
            <h3 className="mt-2 text-sm text-gray-300">{profileData.UserName}</h3>
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
        <div className="flex-1 mx-8">
          <h2 className="text-2xl font-bold text-[#00192f] text-left mt-12">Profile</h2>

          {/* Profile Section */}
          <section className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl p-6 my-5 max-w-7xl text-left">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <img
                src={profileData.Image || defaultProfileImage}
                alt="Profile"
                className="w-[190px] h-[190px] rounded-full object-cover"
                onError={(e) => {
                  e.target.src = defaultProfileImage;
                }}
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">{profileData.UserName}</h3>
                <div className="space-y-3 text-[17px] mt-4">
                  <div className="flex items-center"><span className="text-gray-500">Role:</span><span className="text-gray-700 px-2 font-semibold">{profileData.Role}</span></div>
                  <div className="flex items-center"><span className="text-gray-500">Email:</span><span className="text-gray-700 px-2">{profileData.Email}</span></div>
                  <div className="flex items-center"><span className="text-gray-500">Phone:</span><span className="text-gray-700 px-2">{profileData.Phone}</span></div>
                  <div className="flex items-center"><span className="text-gray-500">Location:</span><span className="text-gray-700 px-2">{profileData.Location}</span></div>
                  <div className="flex space-x-4 pt-2 text-[#00192f]">
                    <a href="#" className="hover:text-blue-500 transition duration-300 text-[28px]">
                      <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href={profileData.LinkedIn} className="hover:text-blue-500 transition duration-300 text-[28px]">
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-6 rounded-xl flex items-center justify-around w-full md:w-48 shadow-md">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Projects</p>
                  <p className="text-3xl font-extrabold text-[#00192f]">{profileData.Projects}</p>
                </div>
                <div className="h-12 border-l-2 border-blue-400"></div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Ranks</p>
                  <p className="text-3xl font-extrabold text-[#00192f]">{profileData.Ranks}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl p-8 space-y-6 text-left">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#00192f]">Basic Information</h2>
                  {isOwner && (
                    <button
                      onClick={handleEditBackgroundClick}
                      className="text-gray-400 hover:text-blue-600 transition"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} className={isEditingBackground ? 'text-blue-600' : ''} />
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="font-semibold text-gray-500 mb-1 text-[20px]">Experience</p>
                    {isEditingBackground ? (
                      <textarea
                        name="Experience"
                        value={editedBackgroundData.Experience}
                        onChange={handleChangeBackground}
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 font-monst text-[17px]"
                        rows="3"
                      />
                    ) : (
                      <p className="text-gray-600 text-[17px]">{profileData.Experience || "No experience provided"}</p>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 mb-1 text-[20px]">Education</p>
                    {isEditingBackground ? (
                      <textarea
                        name="Education"
                        value={editedBackgroundData.Education}
                        onChange={handleChangeBackground}
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 font-monst text-[17px]"
                        rows="3"
                      />
                    ) : (
                      <p className="text-gray-600 text-[17px]">{profileData.Education || "No education provided"}</p>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 mb-1 text-[20px]">Previous Ventures</p>
                    {isEditingBackground ? (
                      <textarea
                        name="PreviousVentures"
                        value={editedBackgroundData.PreviousVentures}
                        onChange={handleChangeBackground}
                        className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 font-monst text-[17px]"
                        rows="3"
                      />
                    ) : (
                      <p className="text-gray-600 text-[17px]">{profileData.PreviousVentures || "No previous ventures provided"}</p>
                    )}
                  </div>
                </div>

                {/* Edit Mode Buttons */}
                {isEditingBackground && (
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={handleCancelEditBackground}
                      className="text-gray-300 bg-red-700 text-lg font-bold hover:bg-red-800 border-2 shadow-md px-6 py-3 rounded-2xl transition-all duration-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBackground}
                      className="text-gray-300 bg-green-600 text-lg font-bold hover:bg-green-700 border-2 shadow-md px-6 py-3 rounded-2xl transition-all duration-300"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* Chart Card */}
              <div className="bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl p-8 flex flex-col items-center justify-center text-[17px]">
                <div className="w-full h-72">
                  <ResponsiveContainer>
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center mt-4 text-gray-700 font-semibold font-monst text-[17px]">Progress Over Time</p>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="shadow-lg rounded-lg p-8 mt-6 font-monst w-full">
            <h3 className="text-2xl text-[#00192f] font-monst mb-4 relative font-[1000]">My Projects
              <div className="py-[5px]">
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-[70px] border-t border-b border-blue-500 py-[5px]"></span>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-[150px] h-[0.5px] bg-blue-500"></span>
              </div>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-gradient-to-b from-blue-50 to-blue-100 text-[#00192f] rounded-lg p-3 shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <img
                    className="w-full h-40 object-cover rounded-lg"
                    src={project.ProjectPhoto}
                    alt={project.ProjectName}
                    onError={(e) => {
                      e.target.src = defaultProfileImage;
                    }}
                  />
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-[#00192f]">{project.ProjectName}</h4>
                    <p className="text-sm text-gray-700">Category: {project.Category}</p>
                    <p className="text-gray-600 text-sm mt-2">
                      {project.ProjectDetails}
                    </p>
                    <p className="text-sm mt-2">
                      Status: <span className={`font-semibold ${project.InvestmentStatus === 'Approved' ? 'text-green-600' :
                          project.InvestmentStatus === 'Pending' ? 'text-yellow-600' :
                            'text-blue-600'
                        }`}>
                        {project.InvestmentStatus}
                      </span>
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => navigateToProjectDetails(project.id)}
                        className="text-gray-300 bg-[#00192F] text-md font-monst hover:text-blue-300 border-2 shadow-md 
                        px-4 rounded-2xl font-bold text-[17px] py-2 border-cyan-900 hover:bg-gray-300 transition-all duration-500"
                      >
                        View Project
                      </button> <br />
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteClick(project.id)}
                          className="text-gray-300 bg-red-600 text-md font-monst hover:text-white border-2 shadow-md px-4 mt-2
                           rounded-2xl font-bold text-[17px] py-2 border-red-700 hover:bg-red-700 transition-all duration-500"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-2">This will:</p>
            <ol className="list-decimal list-inside mb-4 text-gray-600">
              <li className="mb-1">Delete the Investment Related to this project if it exists</li>
              <li>Permanently delete the project</li>
            </ol>
            <p className="text-gray-600 mb-6">Are you sure you want to proceed?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerProfile;