import api from "../api/axios";
import { getToken } from "../utils/auth";


// --------------------------------------------------
// Authorization Header
// --------------------------------------------------

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});


// --------------------------------------------------
// Get Profile
// --------------------------------------------------

export const getProfile = async () => {
  const response = await api.get(
    "/profile/",
    authHeader()
  );

  return response.data;
};


// --------------------------------------------------
// Update Profile
// --------------------------------------------------

export const updateProfile = async (profile) => {
  const response = await api.put(
    "/profile/",
    profile,
    authHeader()
  );

  return response.data;
};


// --------------------------------------------------
// Upload Profile Picture
// --------------------------------------------------

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/profile/profile-picture",
    formData,
    {
      ...authHeader(),

      headers: {
        ...authHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// --------------------------------------------------
// Remove Profile Picture
// --------------------------------------------------

export const removeProfilePicture = async () => {
  const response = await api.delete(
    "/profile/profile-picture",
    authHeader()
  );

  return response.data;
};