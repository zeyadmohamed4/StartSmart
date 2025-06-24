import { useState } from "react";
import { useNavigate } from "react-router-dom";

  const logs = [
    // User Activity Logs
    { id: 1, category: "User Activity Logs", user: "John Doe", role: "Owner", message: "Login/Logout", timestamp: "2025-03-08 12:30" },
    { id: 2, category: "User Activity Logs", user: "Alice Smith", role: "Investor", message: "Failed Login Attempt", timestamp: "2025-03-08 13:15" },
    { id: 3, category: "User Activity Logs", user: "Mark Johnson", role: "Owner", message: "New Account Creation", timestamp: "2025-03-08 14:00" },
    { id: 4, category: "User Activity Logs", user: "Sarah Lee", role: "Owner", message: "Profile Update", timestamp: "2025-03-08 15:45" },
    { id: 5, category: "User Activity Logs", user: "Emily Brown", role: "Investor", message: "Password Reset", timestamp: "2025-03-08 16:10" },
  
    // Project Logs
    { id: 6, category: "Project Logs", user: "Michael Davis", role: "Owner", message: "New Project Created", timestamp: "2025-03-08 16:30" },
    { id: 7, category: "Project Logs", user: "Jessica Wilson", role: "Owner", message: "Project Details Updated", timestamp: "2025-03-08 17:00" },
    { id: 8, category: "Project Logs", user: "David Martinez", role: "Owner", message: "Project Status Changed", timestamp: "2025-03-08 18:20" },
    { id: 9, category: "Project Logs", user: "Christopher Taylor", role: "Owner", message: "Project Deleted", timestamp: "2025-03-08 19:05" },
    { id: 10, category: "Project Logs", user: "Sophia Harris", role: "Owner", message: "Project Funding Approved", timestamp: "2025-03-08 19:30" },
  
    // Investment Logs
    { id: 11, category: "Investment Logs", user: "Daniel White", role: "Investor", message: "New Investment Added", timestamp: "2025-03-08 20:00" },
    { id: 12, category: "Investment Logs", user: "Laura Lewis", role: "Investor", message: "Investment Canceled", timestamp: "2025-03-08 21:30" },
    { id: 13, category: "Investment Logs", user: "Kevin Walker", role: "Owner", message: "Funding Accepted", timestamp: "2025-03-08 22:00" },
    { id: 14, category: "Investment Logs", user: "Anna Allen", role: "Investor", message: "Investment Transferred", timestamp: "2025-03-08 22:45" },
    { id: 15, category: "Investment Logs", user: "Nathan Young", role: "Owner", message: "Investor Refund Processed", timestamp: "2025-03-08 23:15" },
  
    // Notification Logs
    { id: 16, category: "Notification Logs", user: "Emily Scott", role: "Admin", message: "New notification sent", timestamp: "2025-03-08 23:30" },
    { id: 17, category: "Notification Logs", user: "System", role: "System", message: "Notification marked as read", timestamp: "2025-03-08 23:45" },
    { id: 18, category: "Notification Logs", user: "Brian Carter", role: "Admin", message: "Scheduled system maintenance alert", timestamp: "2025-03-09 00:10" },
    { id: 19, category: "Notification Logs", user: "System", role: "System", message: "User reminder sent", timestamp: "2025-03-09 00:30" },
    { id: 20, category: "Notification Logs", user: "Megan Adams", role: "Admin", message: "Security update alert", timestamp: "2025-03-09 00:45" },
  
    // Security Logs
    { id: 21, category: "Security Logs", user: "System", role: "System", message: "Unauthorized login attempts detected", timestamp: "2025-03-09 01:00" },
    { id: 22, category: "Security Logs", user: "Oliver Hill", role: "Owner", message: "Password changed", timestamp: "2025-03-09 01:15" },
    { id: 23, category: "Security Logs", user: "System", role: "System", message: "Suspicious activity detected", timestamp: "2025-03-09 01:30" },
    { id: 24, category: "Security Logs", user: "Rachel Turner", role: "Admin", message: "Security settings updated", timestamp: "2025-03-09 01:45" },
    { id: 25, category: "Security Logs", user: "System", role: "System", message: "Data integrity check performed", timestamp: "2025-03-09 02:00" }
  ];
  
  
function LogSystem() {
  const [filters, setFilters] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const navigate = useNavigate();  // Hook for navigation
  const [isUsersInfoVisible, setIsUsersInfoVisible] = useState(false); // State for dropdown visibility
  const [isPendingAll, setIsPendingAll] = useState(false); // State for dropdown visibility

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({ ...prev, [category]: value }));
  };
  

  const toggleUsersDropdown = (e) => {
    e.preventDefault();
    setIsUsersInfoVisible(!isUsersInfoVisible);
  };

  const togglePendingDropdown = (e) => {
    e.preventDefault();
    setIsPendingAll(!isPendingAll);
  };
 
  return (
    <div className="bg-gradient-to-r from-[#3b5787] to-[#D8C4B6] p-8 mt-40 w-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-white text-gray-500 font-semibold shadow-md transition-all duration-300 ease-in-out sm:block"
              style={{ position: "sticky", top: "5rem", maxHeight: "max-content" }}>
          <ul className="mt-4 space-y-4 mx-4">
              {/* Users Info Dropdown */}
              <li>
                <a
                  href="/"
                  className="block text-center mt-5 mb-8 py-2 bg-[#3b5787] hover:bg-[#415371] text-white rounded-lg pb-4"
                >
                  Home
                </a>
              </li>
              <li>
                <a href="#" onClick={toggleUsersDropdown} className="block text-center py-2 bg-[#3b5787] text-white rounded-lg">
                  Users Info
                </a>
                {isUsersInfoVisible && (
                  <div className="mt-1 rounded-md bg-gray-400 text-white p-2">
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-600" onClick={() => navigate("/AllUsersInfo")}>
                      View All Users
                    </button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-600" onClick={() => navigate("/OwnersInfo")}>
                      Owners
                    </button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-600" onClick={() => navigate("/InvestorsInfo")}>
                      Investors
                    </button>
                  </div>
                )}
              </li>

              {/* Pending Dropdown */}
              <li>
                <a href="#" onClick={togglePendingDropdown} className="block text-center py-2 bg-[#3b5787] text-white rounded-lg">
                  Pending
                </a>
                {isPendingAll && (
                  <div className="mt-1 rounded-md bg-gray-400  text-white p-2">
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-600" onClick={() => navigate("/PendingProjects")}>
                      Pending Projects
                    </button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-600" onClick={() => navigate("/PendingInvestments")}>
                      Pending Investments
                    </button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-600" onClick={() => navigate("/PendingUsers")}>
                      Pending Users
                    </button>
                  </div>
                )}
              </li>

              {/* Other Sidebar Links */}
              <li>
                <a href="/AdminNotifications" className="block text-center py-2 hover:bg-[#415371] rounded-lg hover:text-white">
                  Notifications
                </a>
              </li>
              
              <li>
                <a href="/" className="block text-center py-2 hover:bg-[#415371] rounded-lg hover:text-white mb-20">
                  Logout
                </a>
              </li>
            </ul>
      </div>
      <div className="flex-1 bg-white text-black shadow-md rounded-lg p-6 ml-4">
        <h2 className="text-xl font-semibold mb-4">System Logs</h2>
        {Array.from(new Set(logs.map(log => log.category))).map(category => {
          const filteredLogs = logs.filter(log => log.category === category && (!filters[category] || filters[category] === "All" || log.role === filters[category]));
          return (
            <div key={category} className="mb-8 p-4 border rounded-lg bg-gray-100">
              <h3 className="text-lg font-bold mb-2">{category}</h3>
              <div className="mb-2">
                <label className="mr-2 font-medium">Filter by role:</label>
                <select className="border p-2 rounded" onChange={(e) => handleFilterChange(category, e.target.value)}>
                  <option value="All">All</option>
                  {Array.from(new Set(logs.filter(log => log.category === category).map(log => log.role))).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <table className="min-w-full rounded-lg">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="py-2 px-4 text-center">User</th>
                    <th className="py-2 px-4 text-center">Role</th>
                    <th className="py-2 px-4 text-center">Message</th>
                    <th className="py-2 px-4 text-center">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="border-t">
                      <td className="py-2 px-4 text-center">{log.user}</td>
                      <td className="py-2 px-4 text-center">{log.role}</td>
                      <td className="py-2 px-4 text-center">{log.message}</td>
                      <td className="py-2 px-4 text-center">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LogSystem;
