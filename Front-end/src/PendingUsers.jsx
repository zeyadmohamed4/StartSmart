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
import axios from 'axios';
import Rawana from './imgs/zoz.jpg';

function PendingUsers() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [pendingDropdownOpen, setPendingDropdownOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeUserId, setActiveUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data generator for pending users
  const generateDummyUsers = (count = 10) => {
    return Array(count).fill(null).map((_, index) => ({
      id: `dummy-${100 + index}`,
      userName: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      ssn: `123-45-${6789 + index}`,
      phone: `(555) 555-${1000 + index}`,
      role: index % 2 === 0 ? "Investor" : "Owner",
      photo: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index + 1}.jpg`,
      status: "Pending",
      isAccepted: false,
      isRejected: false,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7)).toISOString()
    }));
  };

  // Fetch pending users from API with fallback to dummy data
  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://localhost:7010/api/Users/GetPendingUsers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 5000
      });

      // Ensure response is always an array
      setUsers(Array.isArray(response?.data) ? response.data : generateDummyUsers());
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setError("Failed to load pending users. Showing sample data.");
      setUsers(generateDummyUsers());
    } finally {
      setLoading(false);
    }
  };

  // Accept user
  const acceptUser = async (userName) => {
    try {
      // Real API call to accept user
      await axios.post(
        `https://localhost:7010/api/Users/AcceptUser`,
        { userName },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      alert("User Accepted Successfully");

      // Refresh users after update
      fetchPendingUsers();
    } catch (err) {
      console.error("Error accepting user:", err);
      setError("Failed to accept user. Please try again.");
    } finally {
      setActiveUserId(null);
    }
  };

  // Reject user
  const rejectUser = async (userName) => {
    try {

      // Real API call to reject user
      await axios.post(
        `https://localhost:7010/api/Users/DeleteUser`,
        { userName },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      alert("User Rejected Successfully");
      // Refresh users after update
      fetchPendingUsers();
    } catch (err) {
      console.error("Error rejecting user:", err);
      setError("Failed to reject user. Please try again.");
    } finally {
      setActiveUserId(null);
    }
  };

  // Filter users based on search term
  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.status?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  useEffect(() => {
    fetchPendingUsers();

    // Check if mobile view
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full content flex bg-gray-100">
      <div className="absolute left-4 mt-40 sm:hidden">
        <button
          className="p-4 text-white"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="w-full flex">
        <div className="flex w-full">
          {/* Sidebar */}
          <div className={`w-[230px] h-auto py-6 rounded-xl bg-gradient-to-b from-[#00192f] to-[#4A9CCD] text-gray-400 font-semibold shadow-md ${isMobile && !sidebarVisible ? 'hidden' : 'block'} sm:block sticky top-20`}>
            <div className="flex flex-col items-center mt-12">
              <img src={Rawana} alt="Investor" className="w-24 h-24 rounded-full shadow-md" />
              <h3 className="mt-2 text-sm text-gray-300">Rawan EL-Olemy</h3>
              <div className="flex items-center py-[5px] mt-6 border-cyan-900 border-2 rounded-full w-full md:w-[200px] px-8 mx-2">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-300 mr-2 text-sm" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full text-white bg-transparent outline-none text-lg placeholder-gray-300"
                />
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
                    <li><a href="/PendingProjectsPredictions" className={`block py-1 px-2 rounded ${currentPath === '/PendingProjectsPredictions' ? 'bg-gray-400 text-white' : 'hover:bg-gray-500 text-gray-300'}`}>Pending Predictions</a></li>
                    <li><a href="/PendingProjectsInfo" className={`block py-1 px-2 rounded ${currentPath === '/PendingProjectsInfo' ? 'bg-gray-400 text-white' : 'hover:bg-gray-500 text-gray-300'}`}>Pending Projects Info</a></li>
                    <li><a href="/PendingInvestments" className={`block py-1 px-2 rounded ${currentPath === '/PendingInvestments' ? 'bg-gray-400 text-white' : 'hover:bg-gray-500 text-gray-300'}`}>Pending Investments</a></li>
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
          <div className=" rounded-xl p-6 shadow-md w-full overflow-x-auto font-monst bg-gray-50">
            <h2 className="text-xl  text-[#00192f] text-left my-6 font-monst font-[1000] mx-6">Pending Users</h2>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-6 gap-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#4A9CCD] text-black font-monst rounded-xl text-[17px] placeholder:text-[17px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 mx-6">
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00192F]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full max-w-6xl mx-auto bg-gray-100 text-gray-700 text-sm shadow-lg rounded-lg mb-4">
                  <thead className="text-[14px] text-center bg-gray-300">
                    <tr>
                      <th className="py-3 px-4 border-b">Photo</th>
                      <th className="py-3 px-4 border-b">User Name</th>
                      <th className="py-3 px-4 border-b">Email</th>
                      <th className="py-3 px-4 border-b">SSN</th>
                      <th className="py-3 px-4 border-b">PhoneNumber</th>
                      <th className="py-3 px-4 border-b">Role</th>
                      <th className="py-3 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className={`text-center hover:bg-gray-200 transition-colors ${user.isAccepted ? 'bg-green-50' :
                            user.isRejected ? 'bg-red-50' : ''
                            }`}
                        >
                          <td className="py-3 px-4 border-b">
                            <div className="flex justify-center">
                              <img src={user.image} alt={user.userName} className="w-12 h-12 rounded-full" />
                            </div>
                          </td>

                          <td className="py-3 px-4 border-b whitespace-nowrap">{user.userName}</td>
                          <td className="py-3 px-4 border-b whitespace-nowrap">{user.email}</td>
                          <td className="py-3 px-4 border-b whitespace-nowrap">{user.ssn}</td>
                          <td className="py-3 px-4 border-b whitespace-nowrap">{user.phoneNumber}</td>
                          <td className="py-3 px-4 border-b whitespace-nowrap">{user.role}</td>

                          <td className="py-3 px-4 border-b whitespace-nowrap">
                            {activeUserId !== user.id ? (
                              <button
                                className="bg-[#5482b0] text-black px-4 py-2 rounded-xl hover:bg-[#3e6d9c]"
                                onClick={() => setActiveUserId(user.id)}
                              >
                                Manage
                              </button>
                            ) : activeUserId === user.id ? (
                              <div className="flex justify-center gap-2">
                                <button
                                  className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
                                  onClick={() => acceptUser(user.userName)}
                                >
                                  Accept
                                </button>
                                <button
                                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                                  onClick={() => rejectUser(user.userName)}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : null}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="py-4 text-center text-gray-500">
                          No pending users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingUsers;