import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getAllUsers = async () => {
  const response = await api.get(
    "/admin/users",
    authHeader()
  );

  return response.data;
};

export const approveUser = async (
  userId
) => {
  const response = await api.put(
    `/admin/approve/${userId}`,
    {},
    authHeader()
  );

  return response.data;
};