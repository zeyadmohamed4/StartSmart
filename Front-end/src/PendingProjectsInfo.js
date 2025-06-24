import React, { useState } from "react";
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

function PendingProjectsInfo() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);
  const [pendingDropdownOpen, setPendingDropdownOpen] = useState(false);
  const [isUsersInfoVisible, setIsUsersInfoVisible] = useState(false);
  const [isPendingAll, setIsPendingAll] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pendingFilter, setPendingFilter] = useState("Projects");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const navigate = useNavigate();

  const toggleUsersDropdown = (e) => {
    e.preventDefault();
    setIsUsersInfoVisible(!isUsersInfoVisible);
  };

  const togglePendingDropdown = (e) => {
    e.preventDefault();
    setIsPendingAll(!isPendingAll);
  };

  const handleManageClick = (id, type) => {
    if (type === "project") {
      setActiveProjectId(id);
    }
  };

  const handleAccept = (id, type) => {
    console.log(`Accepted ${type} with ID: ${id}`);
    if (type === "project") {
      setActiveProjectId(null);
    }
  };

  const handleReject = (id, type) => {
    console.log(`Rejected ${type} with ID: ${id}`);
    if (type === "project") {
      setActiveProjectId(null);
    }
  };

  const infoFields = [
    "Website", "ContactEmail", "Address", "Description", "Milestones", "CompanyPhoto", "CampaignStory"
  ];

  const pendingProjectsInfo = Array.from({ length: 8 }, (_, i) => ({
    id: i + 201,
    Website: `https://company${i + 1}.com`,
    ContactEmail: `contact${i + 1}@company.com`,
    Address: `123 Street ${i + 1}, City B`,
    Description: `This is a brief description for company ${i + 1}.`,
    Milestones: `Reached milestone ${i + 1}`,
    CompanyPhoto: `https://placehold.co/100x50?text=Logo+${i + 1}`,
    CampaignStory: `This is the campaign story for company ${i + 1}.`
  }));

  return (
    <div className="flex w-full content font-monst">
      {/* Sidebar */}
      <div className="w-[220px]  h-auto py-16 rounded-xl 
      bg-gradient-to-b from-[#00192f] to-[#4A9CCD] text-gray-400 font-semibold shadow-md hidden sm:block sticky top-20 ">
        <div className="flex flex-col items-center">
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
                <li><a href="/PendingProjectsPredictions" className={`block py-1 px-2 rounded ${currentPath === '/PendingProjectsPredictions' ? 'bg-gray-400 text-white' : 'hover:bg-gray-500 text-gray-300'}`}>Pending Predictions</a></li>
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
      <div className="bg-gray-50 rounded-xl p-6 shadow-md w-full overflow-x-auto mb-28 font-monst text-left">
        <h2 className="text-xl font-semibold mb-4 text-[#00192f] mt-12 text-left">
          Pending Projects Info
        </h2>
        {pendingFilter === "Projects" && (
          <table className="min-w-full max-w-6xl bg-white text-gray-700 text-sm shadow-lg rounded-lg ">
            <thead className="text-sm text-center bg-gray-200">
              <tr>
                {infoFields.map((field) => (
                  <th key={field} className="py-2 px-4 border-b capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </th>
                ))}
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingProjectsInfo.map((info) => (
                <tr key={info.id} className="text-center">
                  {infoFields.map((field) => (
                    <td key={field} className="py-2 px-4 border-b whitespace-nowrap">
                      {info[field]}
                    </td>
                  ))}
                  <td className="py-2 px-4 border-b">
                    {activeProjectId !== info.id ? (
                      <button
                        className="bg-[#5482b0] text-black px-4 py-2 rounded-xl hover:bg-[#3e6d9c]"
                        onClick={() => handleManageClick(info.id, "project")}
                      >
                        Manage
                      </button>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
                          onClick={() => handleAccept(info.id, "project")}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                          onClick={() => handleReject(info.id, "project")}
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
        )}
      </div>
    </div>
  );
}

export default PendingProjectsInfo;
