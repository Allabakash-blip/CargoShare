import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// -----------------------------
// Get Payments
// -----------------------------
export const getPayments = async () => {
  const response = await api.get(
    "/payments/",
    authHeader()
  );

  return response.data;
};

// -----------------------------
// Create Payment
// -----------------------------
export const createPayment = async (
  paymentData
) => {
  const response = await api.post(
    "/payments/",
    paymentData,
    authHeader()
  );

  return response.data;
};

// -----------------------------
// Update Payment
// -----------------------------
export const updatePayment = async (
  paymentId,
  paymentData
) => {
  const response = await api.put(
    `/payments/${paymentId}`,
    paymentData,
    authHeader()
  );

  return response.data;
};

// -----------------------------
// Delete Payment
// -----------------------------
export const deletePayment = async (
  paymentId
) => {
  const response = await api.delete(
    `/payments/${paymentId}`,
    authHeader()
  );

  return response.data;
};