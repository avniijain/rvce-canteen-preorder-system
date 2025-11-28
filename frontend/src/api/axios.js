import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ==============================
// 🔹 Request Interceptor
// ==============================
api.interceptors.request.use((config) => {
  // Detect admin routes via request URL
  if (config.url.includes("/admin")) {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else {
    const token = localStorage.getItem("userToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==============================
// 🔥 Response Interceptor
// ==============================
// Auto logout if token expired or unauthorized
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response && error.response.status === 401) {
      // Check which token was used (admin or user)
      const isAdminRoute = error.config.url.includes("/admin");

      if (isAdminRoute) {
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
      } else {
        localStorage.removeItem("userToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
