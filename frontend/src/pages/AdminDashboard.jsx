import React, { useEffect, useState } from "react";
import { FaBell, FaTrash, FaCheck } from "react-icons/fa";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

// Key for localStorage
const NOTIFICATIONS_KEY = "admin_notifications";

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Load saved notifications on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Failed to parse saved notifications", e);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle incoming reports
  useEffect(() => {
    if (!socket) return;

    const handleNewReport = (data) => {
      console.log("📢 New report received:", data);

      if (data && data.podcast && data.report && data.reporter) {
        setNotifications((prev) => {
          const exists = prev.some((n) => n.report.id === data.report.id);
          return exists ? prev : [data, ...prev];
        });
        setToastMessage(data.message);
        setTimeout(() => setToastMessage(""), 5000);
      } else {
        console.error("Invalid report data:", data);
      }
    };

    socket.on("newReport", handleNewReport);

    return () => {
      socket.off("newReport", handleNewReport);
    };
  }, [socket]);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleDeletePodcast = async (podcastId) => {
    try {
      const response = await fetch(`/api/admin/podcasts/${podcastId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notif) => notif.podcast.id !== podcastId)
        );
      }
    } catch (error) {
      console.error("Error deleting podcast:", error);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/resolve`, {
        method: "PATCH",
        credentials: "include",
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notif) => notif.report.id !== reportId)
        );
      }
    } catch (error) {
      console.error("Error resolving report:", error);
    }
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleViewPodcast = (notification) => {
    const { id, thumbnail, title, username, views, videoUrl } =
      notification.podcast;

    navigate("/player", {
      state: {
        id,
        image: thumbnail,
        title,
        username,
        views,
        videoUrl,
      },
    });
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-start justify-end p-6">
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="bg-red-600 p-3 rounded-full text-white hover:bg-red-700 transition-colors"
          aria-label="Notifications"
        >
          <FaBell size={24} />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-white text-red-600 text-xs font-bold rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-gray-800 text-white rounded-lg shadow-xl z-50 border border-gray-700">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-lg">
                Reports ({notifications.length})
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAllNotifications}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  Clear All
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No new reports
              </div>
            ) : (
              <ul className="max-h-96 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-700 last:border-b-0 cursor-pointer"
                    onClick={() => handleViewPodcast(notification)}
                  >
                    <div className="p-3 hover:bg-gray-700 transition-colors">
                      <div className="mb-2">
                        <h4 className="font-semibold line-clamp-1">
                          {notification.podcast.title}
                        </h4>
                        <p className="text-sm text-gray-300">
                          {notification.report.reason}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Reported by {notification.reporter.username}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(
                            notification.report.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolveReport(notification.report.id);
                          }}
                          className="px-2 py-1 bg-green-600 text-white rounded text-sm flex items-center hover:bg-green-700"
                        >
                          <FaCheck className="mr-1" /> Resolve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePodcast(notification.podcast.id);
                          }}
                          className="px-2 py-1 bg-red-600 text-white rounded text-sm flex items-center hover:bg-red-700"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-yellow-500 text-black p-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in-up">
          <FaBell className="mr-2" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
