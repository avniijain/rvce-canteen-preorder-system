import { Navigate } from "react-router-dom";

export default function GuestOnlyRoute({ children }) {
  const admin = localStorage.getItem("adminToken");
  const user = localStorage.getItem("userToken");

  if (admin) return <Navigate to="/admin/dashboard" replace />;
  if (user) return <Navigate to="/user/menu" replace />;

  return children;
}
