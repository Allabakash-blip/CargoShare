import api from "../api/axios";
import { getToken } from "../utils/auth";

export const getAnalytics = async () => {
  const token = getToken();

  const response = await api.get("/analytics/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};