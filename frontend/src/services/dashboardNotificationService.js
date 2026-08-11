import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getRecentNotifications = async () => {
  const response = await api.get(
    "/notifications/recent",
    authHeader()
  );

  return response.data;
};