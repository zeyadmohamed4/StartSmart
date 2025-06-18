import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckDouble, FaTrash, FaCircle } from "react-icons/fa";
import axios from "axios";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Rawana from './imgs/Rawana.jpg';

function InvestorNotifications() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showUnread, setShowUnread] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState({
    username: "",
    role: "Investor",
    profileImage: Rawana,
    name: ""
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert('Your session has been ended');
    navigate("/");
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Profile', path: '/InvestorProfile', icon: faUser },
    { label: 'Dashboard', path: '/InvestorHome', icon: faChartLine },
    { label: 'My Investments', path: '/InvestorProjects', icon: faHandshake },
    { label: 'Logout', onClick: handleLogout, icon: faSignOutAlt },
  ];

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
    fetchNotifications();
  }, []);

  // Dummy notifications data - will be used if API fails
  const generateDummyNotifications = () => {
    return [
      {
        id: 1,
        sender: "Ahmed Maher",
        senderPhoto: "https://randomuser.me/api/portraits/men/1.jpg",
        message: "Accepted your investment offer for Delta Project, Let's continue our payment",
        date: new Date("2025-03-08T12:05:00").toISOString(),
        isUnread: true,
        fullMessage: "Ahmed Maher wants to invest in your project with $150,000 at 2% interest on dividends. The investment offer is valid for 7 days. Contact Ahmed for further negotiations.",
        ProjectName: "Delta",
        ProjectId: "proj_001",
        CampaignDealType: "Debt CrowdFunding",
        InvestmentStatus: "Accepted"
      },
      {
        id: 2,
        sender: "Sameh AboElMajd",
        senderPhoto: "https://randomuser.me/api/portraits/men/2.jpg",
        message: "Rejected your investment offer for Alpha project. You might decrease your interests percentage",
        date: new Date("2025-03-07T05:46:00").toISOString(),
        isUnread: true,
        fullMessage: "Sameh AboElMajd has declined your investment terms. Suggested changes: Reduce interest rate from 5% to 3.5% and extend repayment period to 24 months.",
        ProjectName: "Alpha",
        ProjectId: "proj_002",
        CampaignDealType: "Equity CrowdFunding",
        InvestmentStatus: "Rejected"
      },
      {
        id: 4,
        sender: "Michael Scott",
        senderPhoto: "https://randomuser.me/api/portraits/men/4.jpg",
        message: "liked your recent project update",
        date: new Date("2025-03-05T18:57:00").toISOString(),
        isUnread: false,
        fullMessage: "Michael Scott has shown interest in your quarterly progress report. He may consider investing in the next funding round.",
        ProjectName: "Beta",
        ProjectId: "proj_004",
        CampaignDealType: "Equity CrowdFunding",
        InvestmentStatus: "Follow-up"
      },
      {
        id: 5,
        sender: "Sarah Lee",
        senderPhoto: "https://randomuser.me/api/portraits/women/2.jpg",
        message: "commented on your post",
        date: new Date("2025-03-04T11:02:00").toISOString(),
        isUnread: false,
        fullMessage: "Sarah Lee commented: 'Impressive growth metrics! Have you considered expanding to the European market?'",
        ProjectName: "Delta",
        ProjectId: "proj_001",
        CampaignDealType: "Debt CrowdFunding",
        InvestmentStatus: "Engaged"
      },
      {
        id: 6,
        sender: "David Kim",
        senderPhoto: "https://randomuser.me/api/portraits/men/5.jpg",
        message: "requested to join your project team",
        date: new Date("2025-03-03T19:45:00").toISOString(),
        isUnread: false,
        fullMessage: "David Kim has applied for the CTO position. He has 8 years of experience in blockchain development and has attached his portfolio.",
        ProjectName: "Omega",
        ProjectId: "proj_005",
        CampaignDealType: "Team Application",
        InvestmentStatus: "Review"
      },
      {
        id: 7,
        sender: "John Smith",
        senderPhoto: "https://randomuser.me/api/portraits/men/6.jpg",
        message: "accepted your partnership proposal",
        date: new Date("2025-03-02T14:30:00").toISOString(),
        isUnread: false,
        fullMessage: "John Smith has officially accepted your partnership proposal. The agreed terms include 30% equity share and joint decision making.",
        ProjectName: "Zeta",
        ProjectId: "proj_006",
        CampaignDealType: "Partnership",
        InvestmentStatus: "Accepted"
      },
      {
        id: 8,
        sender: "Emma Watson",
        senderPhoto: "https://randomuser.me/api/portraits/women/3.jpg",
        message: "canceled the investment offer for Delta Project",
        date: new Date("2025-03-01T09:15:00").toISOString(),
        isUnread: true,
        fullMessage: "Emma Watson has canceled her active investment offer for Delta Project. As per our terms, you will receive 20% of the investment amount ($30,000) as compensation for this cancellation.",
        ProjectName: "Delta",
        ProjectId: "proj_001",
        CampaignDealType: "Debt CrowdFunding",
        InvestmentStatus: "Canceled"
      }
    ];
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7010/api/Notification/UnReadInvestor', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Map API response to component's expected format
      const mappedNotifications = response.data.map((notif) => ({
        id: notif.id,
        sender: notif.senderName,
        senderPhoto: notif.senderPhoto,
        message: notif.message,
        fullMessage: notif.fullMessage,
        projectName: notif.projectName,
        projectId: notif.projectId,
        date: new Date(notif.createdAt),
        isUnread: notif.isUnread,
        status: notif.status,
        type: notif.type,
        investmentId: notif.investmentId,
        campaignDealType: notif.campaignDealType,
        investmentStatus: notif.investmentStatus,

        investmentAmount: notif.investmentAmount,
        minInvest: notif.minInvest,
        maxInvest: notif.maxInvest,
        /*       "senderID": 11,
         */

      }));

      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      // Fallback to dummy data if API fails
      setNotifications(generateDummyNotifications());
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://localhost:7010/api/Notification/mark-as-read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isUnread: false } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Update UI anyway to maintain consistency
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isUnread: false } : notif
        )
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        'https://localhost:7010/api/Notification/mark-all-as-read',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update notifications state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isUnread: false }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // fallback: update UI
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isUnread: false }))
      );
    }
  };

  const deleteNotification = (id) => {
    setDeleteType("single");
    setShowDeleteConfirm(true);
    setNotificationToDelete(id);
  };

  const deleteAllNotifications = () => {
    setDeleteType("all");
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (deleteType === "single" && notificationToDelete) {
        await axios.delete(
          `https://localhost:7010/api/Notification/${notificationToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            data: { confirm: true }
          }
        );
        setNotifications((prev) => prev.filter((notif) => notif.id !== notificationToDelete));
      } else if (deleteType === "all") {
        await axios.delete(
          'https://localhost:7010/api/Notification/delete-all',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error deleting notification(s):', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      // Update UI anyway to maintain consistency
      if (deleteType === "single" && notificationToDelete) {
        setNotifications((prev) => prev.filter((notif) => notif.id !== notificationToDelete));
      } else if (deleteType === "all") {
        setNotifications([]);
      }
    } finally {
      setShowDeleteConfirm(false);
      setNotificationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const showContinueButton = (status) => {
    return status === "Accepted";
  };


  const handleContinueToPayment = (notification) => {
    navigate('/Payment', {
      state: {
        ProjectName: notification.projectName,
        InvestmentId: notification.investmentId,
        InvestorName: notification.sender,
        ProjectId: notification.projectId,
        CampaignDealType: notification.campaignDealType,
        InvestmentStatus: notification.investmentStatus,
        MinInvest: notification.minInvest,
        MaxInvest: notification.maxInvest,
        InvestmentAmount: notification.investmentAmount
      }
    });
  };
  if (isLoading) {
    return (
      <div className="content w-full flex bg-gray-100 justify-center items-center h-screen">
        <div className="text-xl text-[#00192f]">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="content w-full flex bg-gray-100">
      <div className="w-full flex">
        <div className="flex w-full">
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

          {/* Main Notifications Panel */}
          <div className="w-full p-6 content font-monst">
            <div className="bg-gray-50 shadow-lg rounded-lg p-12 mt-8">
              <h2 className="text-xl text-center text-[#00192f] font-[900]">Your Notifications</h2>

              {/* Recent Notifications Section */}
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold mt-6 text-gray-600">Recent Notifications</h3>
                <div className="flex gap-3 text-[19px]">
                  <button
                    onClick={markAllAsRead}
                    className="text-blue-500 flex items-center text-[17px]"
                  >
                    <FaCheckDouble className="mr-1" /> Mark All As Read
                  </button>
                  <button
                    onClick={deleteAllNotifications}
                    className="text-red-600 flex items-center text-[17px]"
                  >
                    <FaTrash className="mr-1" /> Delete All
                  </button>
                </div>
              </div>

              <div className="space-y-4 mt-4">
                {notifications.filter(n => n.isUnread).length > 0 ? (
                  notifications.filter(n => n.isUnread).map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 shadow-md rounded-lg border-x-4 border-blue-500"
                    >
                      <div className="flex items-center">
                        <a href="/InvestorProfile">
                          <img
                            src={notif.senderPhoto}
                            alt={notif.sender}
                            className="w-12 h-12 rounded-full mr-4 transition-transform ease-in-out hover:scale-150 duration-500 hover:translate-x-2 hover:translate-y-2 cursor-pointer"
                          />
                        </a>
                        <div className="flex-1 ml-2 text-[15px]">
                          <p className="font-semibold text-gray-600 text-left text-[17px]">
                            {notif.sender}: {notif.message}
                            {notif.fullMessage && (
                              <button
                                onClick={() => toggleExpand(notif.id)}
                                className="text-blue-500 text-sm ml-2"
                              >
                                {expanded[notif.id] ? 'see less' : 'see more'}
                              </button>
                            )}
                          </p>
                          {expanded[notif.id] && (
                            <p className="text-left ml-2 text-gray-600 mt-2">{notif.fullMessage}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2 text-left">
                            {new Date(notif.date).toLocaleString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <FaCircle
                          className="text-green-500 cursor-pointer mb-5 text-[16px]"
                          onClick={() => markAsRead(notif.id)}
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="px-3 py-1 bg-blue-600 text-gray-200 rounded-xl text-[17px] hover:bg-blue-700"
                        >
                          Mark as Read
                        </button>

                        {showContinueButton(notif.status) && (
                          <button
                            onClick={() => handleContinueToPayment(notif)}
                            className="px-3 py-1 bg-green-500 text-gray-200 rounded-xl text-[17px] hover:bg-green-600"
                          >
                            Continue
                          </button>
                        )}

                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="px-3 py-2 bg-red-700 text-gray-200 rounded-xl text-[17px] hover:bg-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent notifications</p>
                )}
              </div>

              {/* Old Notifications Section */}
              <h3 className="text-lg font-semibold mt-6 text-gray-500 text-left mb-5">Old Notifications</h3>
              <div className="space-y-4">
                {notifications.filter(n => !n.isUnread).length > 0 ? (
                  notifications.filter(n => !n.isUnread).map((notif) => (
                    <div key={notif.id} className="p-4 shadow-md rounded-lg border-x-4 border-gray-400">
                      <div className="flex items-center">
                        <a href="/InvestorProfile">
                          <img
                            src={notif.senderPhoto}
                            alt={notif.sender}
                            className="w-12 h-12 rounded-full mr-4 transition-transform duration-300 ease-in-out hover:scale-150 hover:translate-x-2 hover:translate-y-2 cursor-pointer"
                          />
                        </a>
                        <div className="flex-1 ml-2 text-[17px]">
                          <p className="font-semibold text-gray-600 text-left">
                            {notif.sender}: {notif.message}
                            {notif.fullMessage && (
                              <button
                                onClick={() => toggleExpand(notif.id)}
                                className="text-blue-500 text-sm ml-2"
                              >
                                {expanded[notif.id] ? 'see less' : 'see more'}
                              </button>
                            )}
                          </p>
                          {expanded[notif.id] && (
                            <p className="text-left ml-2 text-gray-600 mt-2">{notif.fullMessage}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2 text-left">
                            {new Date(notif.date).toLocaleString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <FaCircle
                          className="text-blue-500 cursor-pointer mb-5 text-[16px]"
                          onClick={() => markAsRead(notif.id)}
                        />
                      </div>
                      <div>
                        <div className="flex justify-end gap-2 mt-2">
                          {showContinueButton(notif.status === "Accepted") && (
                            <button
                              onClick={() => handleContinueToPayment(notif)}
                              className="px-3 py-1 bg-green-500 text-gray-200 rounded-xl text-[17px] hover:bg-green-600"
                            >
                              Continue
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="px-3 py-2 bg-red-700 text-gray-200 rounded-xl text-[17px] hover:bg-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No old notifications</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-black mb-4">
              {deleteType === "all" ? "Delete All Notifications" : "Delete Notification"}
            </h3>
            <p className="text-lg font-semibold mb-4 text-gray-600 my-2">
              {deleteType === "all"
                ? "Are you sure you want to delete all notifications"
                : "Are you sure you want to delete this notification?"}
            </p>
            <div className="flex justify-center gap-4">
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
}

export default InvestorNotifications;