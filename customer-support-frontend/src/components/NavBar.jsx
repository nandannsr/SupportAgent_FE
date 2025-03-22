import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { config } from '../config';
import { getNotifications, markNotificationAsRead } from '../services/api';

const NavBar = () => {
  // Access authToken and logout from AuthContext
  const { authToken, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(authToken);
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [authToken]);

  // Set up WebSocket for real-time notifications
  useEffect(() => {
    const socket = new WebSocket(`${config.ws.baseUrl}notifications/`);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data]);
    };
    return () => socket.close(); // Cleanup WebSocket on unmount
  }, []);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(authToken, notification.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      navigate(`/chat/${notification.customer}`);
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Clear authToken and user from AuthContext
    navigate('/login'); // Redirect to login page
  };

  const unreadCount = notifications.length;

  return (
    <nav className="bg-blue-600/30 backdrop-blur-md text-white p-4 flex items-center">
      {/* Home Button */}
      <button onClick={() => navigate('/')} className="font-semibold">
        Home
      </button>

      {/* Right-aligned section for logout and notifications */}
      <div className="ml-auto flex items-center">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-transparent text-white px-4 py-2 rounded hover:bg-white/20"
        >
          Logout
        </button>

        {/* Notification Section */}
        <div className="relative ml-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C8.67 6.165 8 7.388 8 8.75v5.408c0 .62-.26 1.21-.68 1.62L6 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white/30 backdrop-blur-md text-black rounded shadow-lg z-10 border border-white/50">
              <div className="p-2">
                {notifications.length === 0 ? (
                  <p className="text-sm">No new notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className="cursor-pointer p-2 hover:bg-gray-200/50 border-b last:border-0"
                    >
                      <p className="text-sm">{notification.content}</p>
                      <small className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;