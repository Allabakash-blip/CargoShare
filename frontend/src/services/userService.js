import api from "../api/axios";

// --------------------
// Register
// --------------------
export const registerUser = async (userData) => {
  const response = await api.post(
    "/users/register",
    userData
  );

  return response.data;
};

// --------------------
// Login
// --------------------
export const loginUser = async (loginData) => {
  const response = await api.post(
    "/users/login",
    loginData
  );

  return response.data;
};