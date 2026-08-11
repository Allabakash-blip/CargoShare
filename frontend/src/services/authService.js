import api from "../api/axios";

// -----------------------------
// Login
// -----------------------------
export const loginUser = async (credentials) => {
  console.log("Sending login request:", credentials);

  const response = await api.post(
    "/users/login",
    credentials
  );

  return response.data;
};

// -----------------------------
// Register
// -----------------------------
export const registerUser = async (userData) => {
  console.log("Sending registration request:", userData);

  const response = await api.post(
    "/users/register",
    userData
  );

  return response.data;
};