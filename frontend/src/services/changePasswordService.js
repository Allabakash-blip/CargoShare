import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const changePassword = async (passwordData) => {
  const response = await api.put(
    "/profile/change-password",
    passwordData,
    authHeader()
  );

  return response.data;
};