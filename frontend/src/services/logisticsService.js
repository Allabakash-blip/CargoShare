import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get all logistics providers
export const getLogistics = async () => {
  const response = await api.get("/logistics/", authHeader());
  return response.data;
};

// Create logistics provider
export const createLogistics = async (data) => {
  const response = await api.post(
    "/logistics/",
    data,
    authHeader()
  );

  return response.data;
};

// Update logistics provider
export const updateLogistics = async (id, data) => {
  const response = await api.put(
    `/logistics/${id}`,
    data,
    authHeader()
  );

  return response.data;
};

// Delete logistics provider
export const deleteLogistics = async (id) => {
  const response = await api.delete(
    `/logistics/${id}`,
    authHeader()
  );

  return response.data;
};