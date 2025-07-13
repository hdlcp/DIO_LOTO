import axios from "axios";
const BASE_URL = "https://dio-loto-api.onrender.com/api/notifications";

export const getUserNotifications = (userId: string, token: string) =>
  axios.get(`${BASE_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const markNotificationAsRead = (id: number, token: string) =>
  axios.patch(`${BASE_URL}/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const markAllNotificationsAsRead = (userId: string, token: string) =>
  axios.patch(`${BASE_URL}/user/${userId}/mark-all-read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteNotification = (id: number, token: string) =>
  axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }); 