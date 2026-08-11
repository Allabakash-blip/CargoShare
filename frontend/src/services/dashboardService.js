import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getDashboard = async (filter = "today") => {
  const response = await api.get(
    `/dashboard/?filter=${filter}`,
    authHeader()
  );

  return response.data;
};