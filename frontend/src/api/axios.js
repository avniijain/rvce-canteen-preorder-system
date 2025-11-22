import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  // Detect admin routes via request URL instead of route pathname
  if (config.url.startsWith("/admin")) {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else {
    const token = localStorage.getItem("userToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
