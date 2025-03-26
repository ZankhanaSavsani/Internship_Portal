import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isToday, isYesterday } from 'date-fns';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Trash2, 
  Filter, 
  RefreshCw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/notifications');
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        setError(null);
      } else {
        setError('Failed to load notifications. Please try again later.');
      }
    } catch (err) {
      setError('Failed to load notifications. Please try again later.');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications every 2 minutes
    const intervalId = setInterval(fetchNotifications, 120000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { 
                ...notification, 
                recipients: notification.recipients.map(recipient => 
                  recipient.model === 'admin' 
                    ? { ...recipient, isRead: true, readAt: new Date() }
                    : recipient
                )
              }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({
          ...notification,
          recipients: notification.recipients.map(recipient => 
            recipient.model === 'admin' 
              ? { ...recipient, isRead: true, readAt: new Date() }
              : recipient
          )
        }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Delete a notification (soft delete)
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Format the notification timestamp
  const formatTimestamp = (timestamp) => {
    if (isToday(new Date(timestamp))) {
      return `Today at ${format(new Date(timestamp), 'h:mm a')}`;
    } else if (isYesterday(new Date(timestamp))) {
      return `Yesterday at ${format(new Date(timestamp), 'h:mm a')}`;
    } else {
      return format(new Date(timestamp), 'MMM d, yyyy • h:mm a');
    }
  };

  // Get notification icon based on type and priority
  const getNotificationIcon = (type, priority) => {
    const priorityColors = {
      high: "text-red-500",
      medium: "text-amber-500",
      low: "text-blue-500"
    };
    
    const color = priorityColors[priority] || "text-gray-500";
    
    switch (type) {
      case "COMPANY_APPROVAL_SUBMISSION":
      case "COMPANY_APPROVAL_STATUS_CHANGE":
        return <AlertCircle className={`${color} h-5 w-5`} />;
      case "WEEKLY_REPORT_SUBMISSION":
      case "WEEKLY_REPORT_STATUS_CHANGE":
        return <Clock className={`${color} h-5 w-5`} />;
      case "INTERNSHIP_COMPLETION_SUBMISSION":
      case "INTERNSHIP_STATUS_SUBMISSION":
        return <CheckCircle className={`${color} h-5 w-5`} />;
      case "BROADCAST_MESSAGE":
        return <Bell className={`${color} h-5 w-5`} />;
      default:
        return <Bell className={`${color} h-5 w-5`} />;
    }
  };

  // Get readable notification type name
  const getNotificationTypeName = (type) => {
    switch (type) {
      case "COMPANY_APPROVAL_SUBMISSION": return "Company Approval Request";
      case "COMPANY_APPROVAL_STATUS_CHANGE": return "Company Approval Update";
      case "WEEKLY_REPORT_SUBMISSION": return "Weekly Report Submitted";
      case "WEEKLY_REPORT_STATUS_CHANGE": return "Weekly Report Status";
      case "INTERNSHIP_COMPLETION_SUBMISSION": return "Internship Completion";
      case "INTERNSHIP_STATUS_SUBMISSION": return "Internship Status";
      case "BROADCAST_MESSAGE": return "Broadcast Message";
      default: return type.replace(/_/g, ' ').toLowerCase();
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Filter by type
    if (filterType !== 'all' && notification.type !== filterType) {
      return false;
    }
    
    // Filter by priority
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) {
      return false;
    }
    
    return true;
  });

  // Check if admin is a recipient and if notification is unread
  const isUnreadForAdmin = (notification) => {
    const adminRecipient = notification.recipients.find(r => r.model === 'admin');
    return adminRecipient && !adminRecipient.isRead;
  };

  // Check if current admin user is in the recipients list
  const isForCurrentAdmin = (notification) => {
    // This would need to be adjusted to check against the logged-in admin's ID
    // For now, we'll assume all notifications with admin recipients are valid
    return notification.recipients.some(r => r.model === 'admin');
  };

  const notificationTypes = [
    { value: 'all', label: 'All Notifications' },
    { value: 'COMPANY_APPROVAL_SUBMISSION', label: 'Company Approval Requests' },
    // { value: 'COMPANY_APPROVAL_STATUS_CHANGE', label: 'Company Approval Updates' },
    { value: 'WEEKLY_REPORT_SUBMISSION', label: 'Weekly Report Submissions' },
    // { value: 'WEEKLY_REPORT_STATUS_CHANGE', label: 'Weekly Report Status Updates' },
    { value: 'INTERNSHIP_COMPLETION_SUBMISSION', label: 'Internship Completions' },
    { value: 'INTERNSHIP_STATUS_SUBMISSION', label: 'Internship Status Requestss' },
    // { value: 'BROADCAST_MESSAGE', label: 'Broadcast Messages' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const unreadCount = notifications.filter(isUnreadForAdmin).length;

  // Filter out notifications not meant for the current admin
  const relevantNotifications = filteredNotifications.filter(isForCurrentAdmin);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500 mt-1">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          <button 
            onClick={markAllAsRead}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            disabled={unreadCount === 0}
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark all read</span>
          </button>
          
          <button 
            onClick={fetchNotifications} 
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notification Type</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {notificationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && notifications.length === 0 && (
        <div className="flex justify-center items-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && relevantNotifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
          <Bell className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
          <p className="text-gray-500 mt-2">You don't have any notifications yet</p>
        </div>
      )}

      {/* Notifications list */}
      {relevantNotifications.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {relevantNotifications.map((notification) => {
            const isUnread = isUnreadForAdmin(notification);
            
            return (
              <div 
                key={notification._id}
                className={`
                  border-b border-gray-200 last:border-0
                  ${isUnread ? 'bg-blue-50' : ''}
                  transition-colors hover:bg-gray-50
                `}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500">
                            {getNotificationTypeName(notification.type)}
                          </p>
                          <h3 className={`font-medium ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </h3>
                        </div>
                        
                        <div className="flex gap-2">
                          {isUnread && (
                            <button 
                              onClick={() => markAsRead(notification._id)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button 
                            onClick={() => deleteNotification(notification._id)}
                            className="text-gray-400 hover:text-red-600 p-1"
                            title="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className={`mt-1 text-sm ${isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      
                      {notification.link && (
                        <a 
                          href={notification.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          View details <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      )}
                      
                      {notification.targetFilters && (notification.targetFilters.year || notification.targetFilters.semester) && (
                        <div className="mt-2 text-xs text-gray-500">
                          Target: 
                          {notification.targetFilters.year && ` Year ${notification.targetFilters.year}`}
                          {notification.targetFilters.semester && ` Semester ${notification.targetFilters.semester}`}
                        </div>
                      )}
                      
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <p>
                          From: {notification.sender.name || `${notification.sender.model.charAt(0).toUpperCase() + notification.sender.model.slice(1)}`}
                        </p>
                        <span className="mx-2">•</span>
                        <p>{formatTimestamp(notification.createdAt)}</p>
                        
                        {notification.priority !== 'medium' && (
                          <>
                            <span className="mx-2">•</span>
                            <span 
                              className={`
                                ${notification.priority === 'high' ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'}
                                px-1.5 py-0.5 rounded-full text-xs
                              `}
                            >
                              {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} priority
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;