import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export { AdminProtectedRoute, UserProtectedRoute };
