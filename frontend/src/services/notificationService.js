import api from "../api/axios";

// Get all notifications
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

// Get unread notification count
export const getUnreadCount = async () => {
  const response = await api.get("/notifications/count");
  return response.data.count;
};

// Mark one notification as read
export const markAsRead = async (notificationId) => {
  const response = await api.put(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const response = await api.put(
    "/notifications/read-all"
  );

  return response.data;
};

// Create notification
export const createNotification = async (data) => {
  const response = await api.post(
    "/notifications/",
    data
  );

  return response.data;
};