import api from "../api/axios";
import { getToken } from "../utils/auth";

export const getContainers = async () => {
  const token = getToken();

  const response = await api.get("/container/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createContainer = async (containerData) => {
  const token = getToken();

  const response = await api.post(
    "/container/",
    containerData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteContainer = async (containerId) => {
  const token = getToken();

  const response = await api.delete(
    `/container/${containerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};