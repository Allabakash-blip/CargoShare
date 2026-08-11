import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getActivityLogs = async () => {
  const response = await api.get(
    "/activity-logs/",
    authHeader()
  );

  return response.data;
};