import axios from "axios";

const api = axios.create({
  // change this to your backend URL
  baseURL: "http://localhost:5000/api",
});

// attach token automatically
api.interceptors.request.use((config) => {
  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else {
    const token = localStorage.getItem("userToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
