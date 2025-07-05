import React, { useEffect, useState, useRef } from "react";
import {
  FaBell,
  FaTrash,
  FaCheck,
  FaFilter,
  FaEllipsisV,
} from "react-icons/fa";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PodcastActionMenu from "../components/PodcastActionMenu";

const NOTIFICATIONS_KEY = "admin_notifications";

const AdminDashboard = () => {
  const baseURL = "http://localhost:3000/";
  const [activeMenuId, setActiveMenuId] = useState(null);
  const actionMenuRef = useRef();

  const [notifications, setNotifications] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [filter, setFilter] = useState("all");
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  const [allPodcasts, setAllPodcasts] = useState([]);
  const [reportedPodcastsData, setReportedPodcastsData] = useState([]);
  const [summary, setSummary] = useState({
    totalPodcasts: 0,
    totalUsers: 0,
    totalReports: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin");
        return;
      }

      await fetchSummaryData();

      const newSocket = io("http://localhost:3000", {
        withCredentials: true,
        transports: ["websocket"],
      });

      newSocket.on("connect", () => console.log("✅ Socket connected"));
      newSocket.on("connect_error", (err) =>
        console.error("❌ Socket error:", err)
      );
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    };

    initializeDashboard();
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Invalid localStorage notifications:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!socket) return;

    const handleNewReport = (data) => {
      if (data?.podcast && data?.report && data?.reporter) {
        setNotifications((prev) => {
          const exists = prev.some((n) => n.report.id === data.report.id);
          return exists ? prev : [data, ...prev];
        });
        console.log(data);
        setToastMessage(data.message);
        setTimeout(() => setToastMessage(""), 5000);
        fetchSummaryData();
      }
    };

    socket.on("newReport", handleNewReport);
    return () => socket.off("newReport", handleNewReport);
  }, [socket]);

  const fetchSummaryData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const [summaryRes, podcastsRes, reportsRes] = await Promise.all([
        axios.get("http://localhost:3000/api/admin/summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/podcasts/getAll", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/api/admin/reports", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setSummary({
        totalPodcasts: summaryRes.data.totalPodcasts || 0,
        totalUsers: summaryRes.data.totalUsers || 0,
        totalReports: summaryRes.data.totalReports || 0,
      });

      const all = podcastsRes.data || [];
      setAllPodcasts(all);

      const reportedIds = (reportsRes.data || [])
        .filter((r) => r.podcastId && r.podcastId._id)
        .map((r) => r.podcastId._id);

      const reported = all.filter((p) => reportedIds.includes(p._id));
      setReportedPodcastsData(reported);
    } catch (err) {
      console.error("Error fetching summary:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    }
  };

  const handleDeletePodcast = async (podcastId) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`http://localhost:3000/podcasts/delete/${podcastId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await axios.delete(
        `http://localhost:3000/api/reports/delete/${podcastId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.filter((n) => n.podcast.id !== podcastId)
      );
      fetchSummaryData();
    } catch (err) {
      console.error("Failed to delete podcast and reports:", err);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await axios.patch(
        `/api/reports/${reportId}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setNotifications((prev) => prev.filter((n) => n.report.id !== reportId));
      fetchSummaryData();
    } catch (err) {
      console.error("Failed to resolve report:", err);
    }
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    fetchSummaryData();
  };

  const handleViewPodcast = (notification) => {
    console.log(notification.reporter.id);
    const { id, thumbnail, title, username, views, videoUrl } =
      notification.podcast;
    const { uploaderId } = notification.reporter;
    navigate("/player", {
      state: {
        id,
        image: thumbnail,
        title,
        username,
        views,
        videoUrl,
        uploaderId,
        user: "admin",
      },
    });
  };

  const filteredPodcasts =
    filter === "all" ? allPodcasts : reportedPodcastsData;

  return (
    <div className="relative w-full h-screen bg-black p-6 text-white overflow-y-auto">
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="relative">
          <button
            onClick={() =>
              setNotificationDropdownOpen(!notificationDropdownOpen)
            }
            className="relative p-2 bg-gray-700 rounded-full hover:bg-gray-600"
          >
            <FaBell className="text-white text-xl" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
          {notificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded shadow-lg z-10">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <span className="font-semibold">Notifications</span>
                <button
                  onClick={handleClearAllNotifications}
                  className="text-sm text-red-400 hover:text-red-500"
                >
                  Clear All
                </button>
              </div>
              {notifications.map((notif) => (
                <div
                  key={notif.report.id}
                  className="p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                >
                  <p className="text-sm">{notif.message}</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>By: {notif.reporter.username}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewPodcast(notif)}
                        className="text-blue-400 hover:underline"
                      >
                        View
                      </button>
                      {/* <button
                        onClick={() => handleResolveReport(notif.report.id)}
                        className="text-green-400 hover:underline"
                      >
                        Resolve
                      </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Podcasts</h3>
          <p className="text-3xl font-bold text-yellow-400">
            {summary.totalPodcasts}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-green-400">
            {summary.totalUsers}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-2">Reported Podcasts</h3>
          <p className="text-3xl font-bold text-red-400">
            {summary.totalReports}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Podcasts</h2>
        <div className="relative">
          <button
            onClick={() => setFilterDropdown(!filterDropdown)}
            className="flex items-center bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
          >
            <FaFilter className="mr-2" />
            {filter === "all" ? "All Podcasts" : "Reported Podcasts"}
          </button>
          {filterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded shadow-lg z-10">
              <button
                onClick={() => {
                  setFilter("all");
                  setFilterDropdown(false);
                }}
                className={`block w-full px-4 py-2 text-left hover:bg-gray-700 ${
                  filter === "all" ? "bg-gray-700" : ""
                }`}
              >
                All Podcasts
              </button>
              <button
                onClick={() => {
                  setFilter("reported");
                  setFilterDropdown(false);
                }}
                className={`block w-full px-4 py-2 text-left hover:bg-gray-700 ${
                  filter === "reported" ? "bg-gray-700" : ""
                }`}
              >
                Reported Podcasts
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Podcast Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {filteredPodcasts.map((podcast) => (
          <div
            key={podcast._id}
            className="relative bg-gray-800 p-4 rounded shadow hover:shadow-lg"
          >
            <img
              src={`${baseURL}${podcast.thumbnail}`}
              alt={podcast.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-semibold truncate">{podcast.title}</h3>
            <p className="text-sm text-gray-400">
              By {podcast.uploader.username}
            </p>

            <div className="absolute top-2 pl-3 right-0 z-10">
              <button onClick={() => setActiveMenuId(podcast._id)}>
                <FaEllipsisV className="text-white text-xl" />
              </button>
            </div>

            {activeMenuId === podcast._id && (
              <div ref={actionMenuRef}>
                <PodcastActionMenu
                  onDelete={() => handleDeletePodcast(podcast._id)}
                  onIgnore={() => handleResolveReport(podcast._id)}
                  onClose={() => setActiveMenuId(null)}
                />
              </div>
            )}

            <div className="mt-2 flex justify-between items-center">
              <span className="text-yellow-400">{podcast.views} views</span>
              <button
                onClick={() =>
                  console.log("View podcast", podcast._id) ||
                  navigate("/player", {
                    state: {
                      id: podcast._id,
                      image: podcast.thumbnail,
                      title: podcast.title,
                      username: podcast.username,
                      views: podcast.views,
                      videoUrl: podcast.videoUrl,
                      uploaderId: podcast.uploader._id,
                      user: "admin",
                    },
                  })
                }
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
