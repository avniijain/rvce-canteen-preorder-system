import { Routes, Route } from "react-router-dom";
import CanteenAuthSystem from "./pages/authSystem";
import Dashboard from "./pages/admin/AdminDashboard";
import UserMenu from "./pages/user/UserMenu";
import Home from "./pages/Home";

export default function AppRouter() {
  return (
    <Routes>
      {/* Homepage as default route */}
      <Route path="/" element={<Home />} />
      
      {/* Auth/Login page */}
      <Route path="/authSystem" element={<CanteenAuthSystem />} />
      <Route path="/login" element={<CanteenAuthSystem />} />
      <Route path="/auth" element={<CanteenAuthSystem />} />

      {/* Admin Panel */}
      <Route path="/admin/dashboard" element={<Dashboard />} />

      {/* User Panel */}
      <Route path="/user/menu" element={<UserMenu />} />
    </Routes>
  );
}