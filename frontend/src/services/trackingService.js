import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getTracking = async () => {
  const response = await api.get("/tracking/", authHeader());
  return response.data;
};

export const getTrackingByBooking = async (bookingId) => {
  const response = await api.get(
    `/tracking/booking/${bookingId}`,
    authHeader()
  );
  return response.data;
};

export const createTracking = async (trackingData) => {
  const response = await api.post(
    "/tracking/",
    trackingData,
    authHeader()
  );
  return response.data;
};

export const updateTracking = async (
  trackingId,
  trackingData
) => {
  const response = await api.put(
    `/tracking/${trackingId}`,
    trackingData,
    authHeader()
  );

  return response.data;
};

export const deleteTracking = async (trackingId) => {
  const response = await api.delete(
    `/tracking/${trackingId}`,
    authHeader()
  );

  return response.data;
};