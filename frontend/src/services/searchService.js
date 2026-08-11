import axios from "axios";

const API = "http://127.0.0.1:8000";

export const globalSearch = async (query) => {
  if (!query.trim()) return [];

  const response = await axios.get(`${API}/search/`, {
    params: {
      q: query,
    },
  });

  return response.data.results;
};