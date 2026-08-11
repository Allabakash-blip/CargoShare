import api from "../api/axios";
import { getToken } from "../utils/auth";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getDocuments = async (bookingId) => {
  const response = await api.get(
    `/documents/${bookingId}`,
    authHeader()
  );

  return response.data;
};

export const uploadDocument = async (
  bookingId,
  file
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/documents/${bookingId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
export const downloadDocument = async (documentId) => {
  const response = await api.get(
    `/documents/download/${documentId}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = url;

  const disposition =
    response.headers["content-disposition"];

  let filename = "document";

  if (disposition) {
    const match = disposition.match(
      /filename="?([^"]+)"?/
    );

    if (match) {
      filename = match[1];
    }
  }

  link.setAttribute("download", filename);

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};
export const deleteDocument = async (documentId) => {
  const response = await api.delete(
    `/documents/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};