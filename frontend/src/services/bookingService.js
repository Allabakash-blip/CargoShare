import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// -----------------------------
// Get Bookings
// -----------------------------
export const getBookings = async () => {
  const response = await api.get("/booking/", authHeader());
  return response.data;
};

// -----------------------------
// Get My Assigned Bookings
// -----------------------------
export const getMyBookings = async () => {
  const response = await api.get(
    "/booking/my-bookings",
    authHeader()
  );

  return response.data;
};

// -----------------------------
// Create Booking
// -----------------------------
export const createBooking = async (bookingData) => {
  const response = await api.post(
    "/booking/",
    bookingData,
    authHeader()
  );

  return response.data;
};

// -----------------------------
// Delete Booking
// -----------------------------
export const deleteBooking = async (bookingId) => {
  const response = await api.delete(
    `/booking/${bookingId}`,
    authHeader()
  );

  return response.data;
};

// -----------------------------
// Assign Logistics
// -----------------------------
export const assignBooking = async (
  bookingId,
  logisticsId
) => {
  const response = await api.put(
    `/booking/${bookingId}/assign`,
    {
      logistics_id: logisticsId,
    },
    authHeader()
  );

  return response.data;
};

// -----------------------------
// Update Booking Status
// -----------------------------
export const updateBookingStatus = async (
  bookingId,
  status
) => {
  const response = await api.put(
    `/booking/${bookingId}/status`,
    null,
    {
      params: {
        status,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};