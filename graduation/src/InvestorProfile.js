import { useState, useEffect } from 'react';
import { faPenToSquare, faSpinner } from '@fortawesome/free-solid-svg-icons';
import defaultProfileImage from './imgs/Rawana.jpg';
import project from './imgs/project.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

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

const InvestorProfile = () => {
  const navigate = useNavigate();
  const [isEditingBackground, setIsEditingBackground] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    Name: "",
    UserName: "",
    Role: "",
    Email: "",
    Phone: "",
    Location: "",
    Experience: "",
    Education: "",
    PreviousVentures: "",
    Investments: 0,
    Ranks: 0,
    LinkedIn: "",
    Image: ""
  });
  const [investments, setInvestments] = useState([]);
  const [username, setUsername] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);


  
   const handleLogout = () => {
  localStorage.removeItem("token");
  alert('Your session has been ended');
  navigate("/");
};
  const menuItems = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Dashboard', path: '/InvestorHome', icon: faChartLine },
    { label: 'My Investments', path: '/InvestorProjects', icon: faHandshake },
    { label: 'Notifications', path: '/InvestorNotifications', icon: faBell },
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

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

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
        Name: profileApiData.info?.name || "",
        UserName: username || profileApiData.info?.userName || profileApiData.info?.name || "",
        Role: profileApiData.info?.role || "",
        Email: basicInfoData.info?.email || "",
        Phone: profileApiData.info?.phoneNumber || basicInfoData.info?.phone || "",
        Location: basicInfoData.info?.location || "",
        Experience: basicInfoData.info?.experience || "",
        Education: basicInfoData.info?.education || "",
        PreviousVentures: basicInfoData.info?.previousVentures || "",
        Investments: profileApiData.info?.investments || 0,
        Ranks: Math.floor(Math.random() * 34) + 25,
        LinkedIn: basicInfoData.info?.linkedIn || "",
        Image: profileApiData.info?.image || ""
      };

      setProfileData(transformedData);
      setEditedBackgroundData(transformedData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      const dummyData = {
        Name: "Rawan El-Olemy",
        UserName: username || "rawanolemy",
        Role: "Angel Investor",
        Email: "rawanolemy@email.com",
        Phone: "+123 456 7890",
        Location: "New York, USA",
        Experience: "10 years of experience in venture capital and startup investments.",
        Education: "BS in Computer Science from Helwan University, MBA from Harvard Business School",
        PreviousVentures: "Invested in 15+ successful startups including Tech Innovators (acquired by ABC Corp)",
        Investments: 5,
        Ranks: Math.floor(Math.random() * 34) + 25,
        LinkedIn: "https://linkedin.com/in/rawan",
        Image: null
      };
      
      setProfileData(dummyData);
      setEditedBackgroundData(dummyData);
    }
  };

  const fetchInvestments = async () => {
    try {
      const response = await fetch(`https://localhost:7010/api/Investment/GetAll?username=${username}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const transformedInvestments = data.map(investment => ({
        InvestmentId: investment.id,
        ProjectName: investment.projectName,
        Category: investment.category.replace("_", " "),
        Description: investment.projectDetails || "No description available",
        ProjectPhoto: project,
        InvestmentAmount: investment.investmentAmount,
        InvestmentDate: new Date(investment.date).toISOString().split('T')[0],
        Status: investment.status
      }));

      setInvestments(transformedInvestments);
    } catch (error) {
      console.error('Error fetching investments:', error);
      setInvestments([
        {
          InvestmentId: 1,
          ProjectName: "Tech Innovators",
          Category: "Art Design",
          Description: "my project",
          ProjectPhoto: project,
          InvestmentAmount: 5000,
          InvestmentDate: "2025-06-05",
          Status: "Pending"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchProfileData();
      fetchInvestments();
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
    navigate('/ProjectDetails', { 
      state: { 
        projectId: projectId 
      } 
    });
  };

  const handleDeleteClick = (investmentId) => {
    setInvestmentToDelete(investmentId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!investmentToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`https://localhost:7010/api/Investment/Delete/${investmentToDelete}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setInvestments(prevInvestments => 
        prevInvestments.filter(investment => investment.InvestmentId !== investmentToDelete)
      );
      
      setProfileData(prev => ({
        ...prev,
        Investments: prev.Investments - 1
      }));

      alert('Investment withdrawn successfully (with 20% penalty)');
    } catch (error) {
      console.error('Error deleting investment:', error);
      alert('Failed to withdraw investment: ' + error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      setInvestmentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setInvestmentToDelete(null);
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
            <h3 className="mt-2 text-sm text-gray-300">{profileData.Name || profileData.UserName}</h3>
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
                <h3 className="text-2xl font-bold text-gray-800">{profileData.Name || profileData.UserName}</h3>
                <div className="space-y-3 text-[17px] mt-4">
                  <div className="flex items-center"><span className="text-gray-500">Role:</span><span className="text-gray-700 px-2 font-semibold">{profileData.Role}</span></div>
                  <div className="flex items-center"><span className="text-gray-500">Email:</span><span className="text-gray-700 px-2">{profileData.Email}</span></div>
                  <div className="flex items-center"><span className="text-gray-500">Phone:</span><span className="text-gray-700 px-2">{profileData.Phone || "Not provided"}</span></div>
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
                  <p className="text-gray-600 text-sm">Investments</p>
                  <p className="text-3xl font-extrabold text-[#00192f]">{profileData.Investments}</p>
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
                  <button
                    onClick={handleEditBackgroundClick}
                    className="text-gray-400 hover:text-blue-600 transition"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className={isEditingBackground ? 'text-blue-600' : ''} />
                  </button>
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
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                <p className="text-center mt-4 text-gray-700 font-semibold font-monst text-[17px]">Investment Portfolio Growth</p>
              </div>
            </div>
          </section>

          {/* Investments Section */}
          <section className="shadow-lg rounded-lg p-8 mt-6 font-monst w-full">
            <h3 className="text-2xl text-[#00192f] font-monst mb-4 relative font-[1000]">My Investments
              <div className="py-[5px]">
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-[70px] border-t border-b border-blue-500 py-[5px]"></span>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-[150px] h-[0.5px] bg-blue-500"></span>
              </div>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {investments.map((investment) => (
                <div key={investment.InvestmentId} className="bg-gradient-to-b from-blue-50 to-blue-100 text-[#00192f] rounded-lg p-3 shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <img className="w-full h-40 object-cover rounded-lg" src={investment.ProjectPhoto} alt={investment.ProjectName} />
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-[#00192f]">{investment.ProjectName}</h4>
                    <p className="text-sm text-gray-700">Category: {investment.Category}</p>
                    <p className="text-gray-500 mt-2 text-[16px]">{investment.Description}</p>
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="text-gray-600">Amount: </span>
                        <span className="font-semibold">${investment.InvestmentAmount.toLocaleString()}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Date: </span>
                        <span className="font-semibold">{investment.InvestmentDate}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Status: </span>
                        <span className={`font-semibold ${
                          investment.Status === 'Active' ? 'text-green-600' : 
                          investment.Status === 'Pending' ? 'text-blue-600' : 
                          'text-yellow-600'
                        }`}>
                          {investment.Status}
                        </span>
                      </p>
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => navigateToProjectDetails(investment.InvestmentId)}
                        className="text-gray-300 bg-[#00192F] text-md font-monst hover:text-blue-300 border-2 shadow-md 
                        px-4 rounded-2xl font-bold text-[17px] py-2 border-cyan-900 hover:bg-gray-300 transition-all duration-500"
                      >
                        View Details
                      </button> <br/>
                      <button 
                        onClick={() => handleDeleteClick(investment.InvestmentId)}
                        className="text-gray-300 bg-red-600 text-md font-monst hover:text-white border-2 shadow-md px-4 mt-2
                         rounded-2xl font-bold text-[17px] py-2 border-red-700 hover:bg-red-700 transition-all duration-500"
                      >
                        Withdraw
                      </button>
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
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Withdrawal</h3>
            <p className="text-gray-600 mb-2">This will:</p>
            <ol className="list-decimal list-inside mb-4 text-gray-600">
              <li className="mb-1">Initiate the withdrawal process for this investment</li>
              <li>Will cost you 20% of the investment amount</li>
            </ol>
            <p className="text-gray-600 mb-6">Are you sure you want to proceed?</p>
            <div className="flex justify-end space-x-4">
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Withdraw"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorProfile;