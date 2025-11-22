import { Routes, Route } from "react-router-dom";
import CanteenAuthSystem from "./pages/authSystem";
import Dashboard from "./pages/admin/AdminDashboard";
import UserMenu from "./pages/user/UserMenu";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CanteenAuthSystem />} />
      <Route path="/auth" element={<CanteenAuthSystem />} />

      {/* Admin Panel */}
      <Route path="/admin/dashboard" element={<Dashboard />} />

      {/* User Panel */}
      <Route path="/user/menu" element={<UserMenu />} />
    </Routes>
  );
}
