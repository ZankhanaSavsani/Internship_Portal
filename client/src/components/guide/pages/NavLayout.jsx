import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Menu,
  X,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  CustomDropdownMenuItem,
  CustomDropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useAuth } from "../../layouts/AuthProvider";
import Cookies from "js-cookie";
import axios from "axios";

const GuideLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      setUsername(userData.guideName || "Guide");
    }
    fetchUnreadCount();
    fetchRecentNotifications();
    
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchRecentNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASEURL}/api/notifications/unread-count`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setNotificationCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASEURL}/api/notifications/recent`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_BASEURL}/api/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      fetchUnreadCount();
      fetchRecentNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const navItems = [
    {
      icon: <ClipboardList size={20} />,
      text: "Weekly Reports",
      path: "/guide/ManageWeeklyReports",
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleGuideProfile = () => {
    navigate("/guide/GuideProfile");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "WEEKLY_REPORT_SUBMISSION":
        return <ClipboardList className="h-4 w-4 text-blue-600" />;
      case "WEEKLY_REPORT_STATUS_CHANGE":
        return <Check className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white z-50 px-4 py-3 shadow-md flex justify-between items-center">
        <div className="h-12 flex items-center">
          <img
            src="/images/logo.png"
            alt="Institution Logo"
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
            >
              <Bell size={20} className="text-gray-600" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white">
                  {notificationCount}
                </Badge>
              )}
            </Button>
            {notificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-3 hover:bg-gray-100 cursor-pointer ${
                            !notification.recipients[0]?.isRead ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-2">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {notification.message}
                              </p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(notification.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 focus:outline-none"
          >
            {isOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static 
        w-64 h-[calc(100vh-4rem)] lg:h-screen
        bg-white shadow-lg 
        transition-transform duration-300 ease-in-out
        z-40
        flex flex-col
        ${
          isOpen
            ? "translate-x-0 mt-16 lg:mt-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="hidden lg:flex p-4 justify-center items-center">
          <div className="h-16 flex items-center">
            <img
              src="/images/logo.png"
              alt="Institution Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4">
          <div className="hidden lg:flex justify-between items-center mb-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              >
                <Bell size={20} className="text-gray-600" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
              {notificationDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y">
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-3 hover:bg-gray-100 cursor-pointer ${
                              !notification.recipients[0]?.isRead ? "bg-blue-50" : ""
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start space-x-2">
                              <div className="mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {notification.message}
                                </p>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(notification.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DropdownMenu
            trigger={
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={20} className="text-gray-700" />
                </div>
                <span className="font-medium text-gray-700">{username}</span>
                <ChevronDown size={16} className="text-gray-600" />
              </div>
            }
          >
            <CustomDropdownMenuItem
              className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg"
              onClick={handleGuideProfile}
            >
              <User className="mr-2 h-4 w-4 text-gray-600" />
              <span>Profile</span>
            </CustomDropdownMenuItem>
            <CustomDropdownMenuSeparator />
            <CustomDropdownMenuItem
              className="cursor-pointer text-red-600 hover:bg-gray-100 p-3 rounded-lg"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </CustomDropdownMenuItem>
          </DropdownMenu>
        </div>
      </aside>

      <main className="flex-1 lg:min-h-screen bg-gray-50 mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  );
};

export default GuideLayout;