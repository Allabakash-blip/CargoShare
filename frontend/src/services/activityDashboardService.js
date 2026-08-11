import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getRecentActivities = async () => {
  const response = await api.get(
    "/activity-logs/recent",
    authHeader()
  );

  return response.data;
};