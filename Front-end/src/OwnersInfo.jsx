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

function OwnersInfo() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [pendingDropdownOpen, setPendingDropdownOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data generator for owners only
  const generateDummyOwners = (count = 10) => {
    const firstNames = ["John", "Jane", "Alex", "Sam", "Chris", "Taylor", "Jordan", "Cameron"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson"];
    const domains = ["example.com", "test.com", "demo.com", "domain.com"];

    return Array(count).fill(null).map((_, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];

      return {
        id: `dummy-${index}`,
        name: `${firstName} ${lastName}`,
        phone: `+1${Math.floor(2000000000 + Math.random() * 8000000000)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
        role: "Owner",
        photo: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${index % 50}.jpg`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString()
      };
    });
  };

  // Fetch owners from API with fallback to dummy data
  const fetchOwners = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint for owners
      const response = await axios.get('https://localhost:7010/api/Users/GetOwners', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 5000 // 5 second timeout
      });

      // Ensure we always set an array of owners
      setUsers(Array.isArray(response?.data) ? response.data : generateDummyOwners());
    } catch (err) {
      console.error("Error fetching owners:", err);
      setError("Failed to load owners. Showing sample data.");
      setUsers(generateDummyOwners());
    } finally {
      setLoading(false);
    }
  };

  // Delete owner function
  const deleteOwner = async (userName) => {
    try {
      await axios.post('https://localhost:7010/api/Users/DeleteUser',
        { userName }, // يتم إرسال userName هنا
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchOwners();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  // Filter owners based on search term
  const filteredOwners = Array.isArray(users) ? users.filter(owner =>
    owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  useEffect(() => {
    fetchOwners();

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
          <div className=" rounded-xl p-6 shadow-md w-full overflow-x-auto font-monst bg-gray-50">
            <h2 className="text-xl  text-[#00192f] text-left my-6 font-monst font-[1000] mx-6">Project Owners</h2>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-6 gap-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-700" />
                </div>
                <input
                  type="text"
                  placeholder="Search owners..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9CCD] font-monst text-black text-[17px] placeholder:text-[17px]"
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
                      <th className="py-3 px-4 border-b">Owner Name</th>
                      <th className="py-3 px-4 border-b">Phone</th>
                      <th className="py-3 px-4 border-b">Email</th>
                      <th className="py-3 px-4 border-b">Photo</th>
                      <th className="py-3 px-4 border-b">Country</th>
                      <th className="py-3 px-4 border-b">City</th>
                      <th className="py-3 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOwners.length > 0 ? (
                      filteredOwners.map((owner) => (
                        <tr key={owner.id} className="text-center hover:bg-gray-200 transition-colors">
                          <td className="py-3 px-4 border-b">{owner.name}</td>
                          <td className="py-3 px-4 border-b">{owner.phoneNumber}</td>
                          <td className="py-3 px-4 border-b">{owner.email}</td>
                          <td className="py-3 px-4 border-b">{owner.country}</td>
                          <td className="py-3 px-4 border-b">{owner.city}</td>
                          <td className="py-3 px-4 border-b">
                            <div className="flex justify-center items-center">
                              <img
                                src={owner.image}
                                alt={`Owner ${owner.userName}`}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/40';
                                }}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 border-b">
                            <button
                              onClick={() => deleteOwner(owner.userName)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-4 text-center text-gray-500">
                          No owners found matching your criteria
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

export default OwnersInfo;