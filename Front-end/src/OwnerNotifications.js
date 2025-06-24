import { useState, useEffect } from "react";
import { FaCheckDouble, FaTrash, FaCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import Rawana from './imgs/Rawana.jpg';

function OwnerNotifications() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // State for user data
  const [userData, setUserData] = useState({
    username: "",
    role: "Owner",
    profileImage: Rawana,
    name: ""
  });

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7010/api/Notification/UnReadOwner', {
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
        investmentId: notif.investmentId
      }));

      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/');
      }

      // Fallback to dummy notifications
      const dummyNotifications = [
        {
          id: 1,
          sender: "Osama Ahmed",
          senderPhoto: "https://randomuser.me/api/portraits/men/1.jpg",
          message: "wants to invest in your project Alpha",
          fullMessage: "Osama Ahmed wants to invest in your project Alpha with 150000$ and of interest 2% on Dividends. The investment offer is valid for 7 days.",
          projectName: "Alpha",
          projectId: "proj001",
          date: new Date("2025-03-08T12:05:00"),
          isUnread: true,
          status: "",
          type: "investment-request"
        },
        {
          id: 2,
          sender: "John Doe",
          senderPhoto: "https://randomuser.me/api/portraits/men/2.jpg",
          message: "has canceled the investment in your project Beta",
          fullMessage: "John Doe has finished his partnership with you and canceled the investment. You will receive 50% of the investment amount you agreed on before.",
          projectName: "Beta",
          projectId: "proj002",
          date: new Date("2025-03-07T05:46:00"),
          isUnread: true,
          status: "",
          type: "investment-cancellation"
        },
        {
          id: 3,
          sender: "Admin Team",
          senderPhoto: "https://randomuser.me/api/portraits/women/3.jpg",
          message: "Your project Gamma has been Approved",
          fullMessage: "Congratulations! Your project Gamma has been approved by our admin team and is now live on the platform.",
          projectName: "Gamma",
          projectId: "proj003",
          date: new Date("2025-03-06T15:26:00"),
          isUnread: false,
          status: "Approved",
          type: "project-status"
        },
        {
          id: 4,
          sender: "Admin Team",
          senderPhoto: "https://randomuser.me/api/portraits/women/3.jpg",
          message: "Your project Delta has been Rejected",
          fullMessage: "We regret to inform you that your project Delta has been rejected. Please review our guidelines and submit again.",
          projectName: "Delta",
          projectId: "proj004",
          date: new Date("2025-03-05T18:57:00"),
          isUnread: true,
          status: "Rejected",
          type: "project-status"
        },
        {
          id: 5,
          sender: "Sarah Lee",
          senderPhoto: "https://randomuser.me/api/portraits/women/2.jpg",
          message: "commented on your post",
          fullMessage: "Sarah Lee commented on your post: 'This is really insightful! Looking forward to more updates.'",
          projectName: "Epsilon",
          projectId: "proj005",
          date: new Date("2025-03-04T11:02:00"),
          isUnread: false,
          status: "",
          type: "comment"
        }
      ];

      setNotifications(dummyNotifications);
    } finally {
      setLoading(false);
    }
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
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

const handleLogout = () => {
  localStorage.removeItem("token");
  alert('Your session has been ended');
  navigate("/");
};
  const menuItems = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Profile', path: '/OwnerProfile', icon: faUser },
    { label: 'Dashboard', path: '/OwnerHome', icon: faChartLine },
    { label: 'My Projects', path: '/OwnerProjects', icon: faHandshake },
    { label: 'Logout', onClick: handleLogout, icon: faSignOutAlt }, 
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
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
          notif.id == id ? { ...notif, isUnread: false } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Update UI anyway to maintain consistency
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id == id ? { ...notif, isUnread: false } : notif
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

      // Update notification state in UI
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isUnread: false }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Fallback: Update UI anyway
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

  const handleAccept = async (notificationId, projectId, investmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://localhost:7010/api/Investment/AcceptInvestment?notfiId=${notificationId}`,
        { projectId, id: investmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // After successful API call, update the state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id == notificationId ? { ...notif, status: 'Accepted' } : notif
        )
      );
    } catch (error) {
      console.error('Error accepting notification:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const handleReject = async (notificationId, projectId, investmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://localhost:7010/api/Investment/RejectInvestment?notifId=${notificationId}`,
        { projectId, id: investmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // After successful API call, update the state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id == notificationId ? { ...notif, status: 'Rejected' } : notif
        )
      );
    } catch (error) {
      console.error('Error rejecting notification:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const navigateToProjectDetails = (projectId) => {
    navigate('/ProjectDetails', {
      state: {
        projectId: projectId
      }
    });
  };

  const renderNotificationActions = (notif) => {
    if (notif.status == 'Rejected') {
      return (
        <div className="flex justify-end gap-2 mt-2">
          {notif.isUnread && (
            <button
              onClick={() => markAsRead(notif.id)}
              className="px-3 py-1 bg-blue-600 text-gray-200 rounded-xl text-[17px] hover:bg-blue-700"
            >
              Mark as Read
            </button>
          )}
          <button
            className="px-3 py-1  text-gray-200 rounded-xl text-[17px] bg-red-700  " disabled
          >
            Rejected
          </button>
          <button
            onClick={() => deleteNotification(notif.id)}
            className="px-3 py-2 bg-red-700 text-gray-200 rounded-xl text-[17px] hover:bg-red-900"
          >
            Delete
          </button>
        </div>
      );
    } else if (notif.status == 'Accepted') {
      return (
        <div className="flex justify-end gap-2 mt-2">
          {notif.isUnread && (
            <button
              onClick={() => markAsRead(notif.id)}
              className="px-3 py-1 bg-blue-600 text-gray-200 rounded-xl text-[17px] hover:bg-blue-700"
            >
              Mark as Read
            </button>
          )}
          <button
            className="px-3 py-1  text-gray-200 rounded-xl text-[17px] bg-green-700  " disabled
          >
            Accepted
          </button>
          <button
            onClick={() => deleteNotification(notif.id)}
            className="px-3 py-2 bg-red-700 text-gray-200 rounded-xl text-[17px] hover:bg-red-900"
          >
            Delete
          </button>
        </div>
      );
    }

    if (notif.status == 'Cancelled') {
      return (
        <div className="flex justify-end gap-2 mt-2">
          {notif.isUnread && (
            <button
              onClick={() => markAsRead(notif.id)}
              className="px-3 py-1 bg-blue-600 text-gray-200 rounded-xl text-[17px] hover:bg-blue-700"
            >
              Mark as Read
            </button>
          )}
          <button
            onClick={() => deleteNotification(notif.id)}
            className="px-3 py-2 bg-red-700 text-gray-200 rounded-xl text-[17px] hover:bg-red-900"
          >
            Delete
          </button>
        </div>
      );
    }

    return (
      <div className="flex justify-end gap-2 mt-2">
        {notif.isUnread && (
          <button
            onClick={() => markAsRead(notif.id)}
            className="px-3 py-1 bg-blue-600 text-gray-200 rounded-xl text-[17px] hover:bg-blue-700"
          >
            Mark as Read
          </button>
        )}

        {notif.status != 'Rejected' && (
          <button
            onClick={() => handleAccept(notif.id, notif.projectId, notif.investmentId)}
            className={`px-3 py-1 rounded-xl text-[17px] ${
              notif.status === 'Accepted'
                ? 'bg-green-700 text-white cursor-default'
                : 'bg-green-600 text-gray-200 hover:bg-green-700'
            }`}
            disabled={notif.status == 'Accepted'}
          >
            {notif.status == 'Accepted' ? 'Accepted' : 'Accept'}
          </button>
        )}

        {notif.status != 'Accepted' && (
          <button
            onClick={() => handleReject(notif.id, notif.projectId, notif.investmentId)}
            className={`px-3 py-1 rounded-xl text-[17px] ${
              notif.status == 'Rejected'
                ? 'bg-red-700 text-white cursor-default'
                : 'bg-red-500 text-gray-200 hover:bg-red-700'
            }`}
            disabled={notif.status == 'Rejected'}
          >
            {notif.status == 'Rejected' ? 'Rejected' : 'Reject'}
          </button>
        )}

        <button
          onClick={() => deleteNotification(notif.id)}
          className="px-3 py-2 bg-red-700 text-gray-200 rounded-xl text-[17px] hover:bg-red-900"
        >
          Delete
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="content flex bg-gray-100 font-monst w-full justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter notifications into recent (unread) and old (read)
  const recentNotifications = notifications.filter(n => n.isUnread);
  const oldNotifications = notifications.filter(n => !n.isUnread);

  return (
    <div className="content flex bg-gray-100 font-monst w-full">
      <div className="w-full flex">
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

          {/* Main Notifications Panel */}
          <div className="w-full p-6 content">
            <div className="bg-gray-50 shadow-lg rounded-lg p-12 mt-8">
              <h2 className="text-xl text-center text-[#00192f] font-[900]">Your Notifications</h2>

              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold mt-6 text-gray-600">Recent Notifications</h3>
                <div className="flex gap-3">
                  <button
                    onClick={markAllAsRead}
                    className="text-blue-500 flex items-center text-[17px]"
                  >
                    <FaCheckDouble className="mr-1" /> Mark All As Read
                  </button>
                  <button
                    onClick={deleteAllNotifications}
                    className="text-red-500 flex items-center text-[17px]"
                  >
                    <FaTrash className="mr-1" /> Delete All
                  </button>
                </div>
              </div>

              <div className="space-y-4 mt-4">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 shadow-md rounded-lg border-x-4 ${notif.type === 'investment-cancellation' ? 'border-orange-500' :
                        notif.type === 'project-status' ? 'border-purple-500' : 'border-blue-500'
                        }`}
                    >
                      <div className="flex items-center">
                        <a href="/InvestorProfile">
                          <img
                            src={notif.senderPhoto}
                            alt={notif.sender}
                            className="w-12 h-12 rounded-full mr-4 transition-transform duration-300 ease-in-out hover:scale-150 hover:translate-x-2 hover:translate-y-2 cursor-pointer"
                          />
                        </a>
                        <div className="flex-1 ml-2">
                          <p className="font-semibold text-gray-600 text-left text-[17px]">
                            {notif.sender}: {notif.message}
                            <button
                              onClick={() => toggleExpand(notif.id)}
                              className="text-blue-500 text-sm ml-2"
                            >
                              {expanded[notif.id] ? 'See less' : 'See more'}
                            </button>
                          </p>
                          {expanded[notif.id] && (
                            <p className="text-gray-600 mt-2 text-left text-sm ml-2">{notif.fullMessage}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2 text-left">
                            {notif.date.toLocaleString()} • {notif.projectName}
                          </p>
                        </div>
                        <FaCircle
                          className="text-green-500 cursor-pointer mb-5 text-[16px]"
                          onClick={() => markAsRead(notif.id)}
                        />
                      </div>
                      {renderNotificationActions(notif)}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent notifications</p>
                )}
              </div>

              <h3 className="text-lg font-semibold mt-6 text-gray-500 text-left mb-5">Old Notifications</h3>
              <div className="space-y-4">
                {oldNotifications.length > 0 ? (
                  oldNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 shadow-md rounded-lg border-x-4 ${notif.type === 'investment-cancellation' ? 'border-orange-500' :
                        notif.type === 'project-status' ? 'border-purple-500' : 'border-gray-400'
                        }`}
                    >
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
                            <button
                              onClick={() => toggleExpand(notif.id)}
                              className="text-blue-500 text-sm ml-2"
                            >
                              {expanded[notif.id] ? 'See less' : 'See more'}
                            </button>
                          </p>
                          {expanded[notif.id] && (
                            <p className="text-gray-600 mt-2 text-left text-sm ml-2">{notif.fullMessage}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2 text-left">
                            {notif.date.toLocaleString()} • {notif.projectName}
                          </p>
                        </div>
                        <FaCircle
                          className="text-blue-500 cursor-pointer mb-5 text-[16px]"
                          onClick={() => markAsRead(notif.id)}
                        />
                      </div>
                      {renderNotificationActions(notif)}
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
              {deleteType === "all"
                ? "Are you sure you want to delete all notifications?"
                : "Are you sure you want to delete this notification?"}
            </h3>
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

export default OwnerNotifications;