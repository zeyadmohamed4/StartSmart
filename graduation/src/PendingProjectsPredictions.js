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
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Rawana from './imgs/zoz.jpg';

function PendingProjectsPredictions() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [pendingDropdownOpen, setPendingDropdownOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pendingFilter, setPendingFilter] = useState("Projects");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [pendingProjectsPredictions, setPendingProjectsPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fields = [
    "projectName",
    "userName",
    "totalFundingRounds",
    "totalMilestones",
    "mileStoneYear",
    "totalPartenerships",
    "fundingAmount",
    "noOfInvestors",
    "fundAmountRaised",
    "foundingYear",
    "fundingYear",
    "fundingFundYear",
    "averageFundingPerRound",
    "firstFundedAt",
    "category",
    "location",
    "country",
    "isActiveTill",
    "status",
    "campaignDealType",
    "fundingRoundType",
    "totalFundingRecieved",
    "companyAge",
    "funding_Source",
  ];

  // Fetch pending projects predictions
  useEffect(() => {
    const fetchPendingProjects = async () => {
      try {
        const response = await fetch('https://localhost:7010/api/Project/GetPendingProjects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you use token-based auth
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pending projects');
        }

        const data = await response.json();
        setPendingProjectsPredictions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProjects();
  }, []);

  const handleManageClick = (id, type) => {
    if (type === "project") {
      setActiveProjectId(id);
    }
  };

  const handleAccept = async (id, type) => {
    try {
      const response = await fetch(`https://localhost:7010/api/Project/AcceptProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept project');
      }

      // Refresh the data instead of full page reload
      const updatedProjects = pendingProjectsPredictions.filter(project => project.id !== id);
      setPendingProjectsPredictions(updatedProjects);
      setActiveProjectId(null);

      alert('Project accepted successfully!');

    } catch (err) {
      console.error('Accept error:', err);
      alert(`Accept failed: ${err.message}`);
    }
  };

  const handleReject = async (id, type) => {
    try {
      const response = await fetch(`https://localhost:7010/api/Project/DeleteProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject project');
      }

      // Refresh the data instead of full page reload
      const updatedProjects = pendingProjectsPredictions.filter(project => project.id !== id);
      setPendingProjectsPredictions(updatedProjects);
      setActiveProjectId(null);

      alert('Project rejected successfully!');

    } catch (err) {
      console.error('Reject error:', err);
      alert(`Reject failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full content flex justify-center items-center h-screen">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full content flex justify-center items-center h-screen">
        <div className="text-xl font-bold text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full content flex">
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

      <div className="w-full content flex font-monst bg-gray-50">
        <div className="flex w-full">
          <div className="w-[230px] h-auto py-6 rounded-xl bg-gradient-to-b from-[#00192f] to-[#4A9CCD] text-gray-400 font-semibold shadow-md hidden sm:block sticky top-20">
            <div className="flex flex-col items-center mt-12">
              <img src={Rawana} alt="Investor" className="w-24 h-24 rounded-full shadow-md" />
              <h3 className="mt-2 text-sm text-gray-300">Rawan EL-Olemy</h3>
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

          <div className="bg-gray-50 rounded-xl p-6 shadow-md w-full overflow-x-auto mb-10 font-monst text-left">
            <h2 className="text-xl font-bold font-monst mb-6 mt-12 text-[#00192f] text-left">
              Pending Projects Predictions
            </h2>

            {pendingProjectsPredictions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg">No pending projects predictions found</p>
              </div>
            ) : (
              pendingFilter === "Projects" && (
                <table className="min-w-full max-w-6xl mx-auto bg-white text-gray-700 text-sm shadow-lg rounded-lg ">
                  <thead className="text-[12px] text-center bg-gray-200">
                    <tr>
                      {fields.map((field) => (
                        <th key={`header-${field}`} className="py-2 px-4 border-b capitalize">
                          {field.replace(/([A-Z])/g, " $1").trim()}
                        </th>
                      ))}
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProjectsPredictions.map((project) => (
                      <tr key={`project-${project.id}`} className="text-center">
                        {fields.map((field) => (
                          <td key={`${project.id}-${field}`} className="py-2 px-4 border-b whitespace-nowrap">
                            {project[field]}
                          </td>
                        ))}
                        <td className="py-2 px-4 border-b">
                          {activeProjectId !== project.id ? (
                            <button
                              className="bg-[#5482b0] text-black px-4 py-2 rounded-xl hover:bg-[#3e6d9c]"
                              onClick={() => handleManageClick(project.id, "project")}
                            >
                              Manage
                            </button>
                          ) : (
                            <div className="flex justify-center space-x-2">
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
                                onClick={() => handleAccept(project.id, "project")}
                              >
                                Accept
                              </button>
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                                onClick={() => handleReject(project.id, "project")}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingProjectsPredictions;