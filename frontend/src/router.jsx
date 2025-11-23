import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AuthSystem from "./pages/authSystem";
import Dashboard from "./pages/admin/AdminDashboard";
import UserMenu from "./pages/user/UserMenu";
import Cart from "./pages/user/Cart"; // ADD THIS IMPORT
import AdminMenu from "./pages/admin/AdminMenu";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import GuestOnlyRoute from "./components/GuestOnlyRoute";

import PublicLayout from "./layouts/PublicLayout";
import UserLayout from "./layouts/userLayout";
import AdminLayout from "./layouts/adminLayout";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicLayout>
          <Home />
        </PublicLayout>
      } />

      {/* Login / Signup */}
      <Route
        path="/login"
        element={
          <GuestOnlyRoute>
            <AuthSystem />
          </GuestOnlyRoute>
        }
      />

      <Route
        path="/auth"
        element={
          <GuestOnlyRoute>
            <AuthSystem />
          </GuestOnlyRoute>
        }
      />

      {/* Admin Protected */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/menu"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <AdminMenu />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Public menu - no authentication required */}
      <Route path="/menu" element={<UserMenu />} />

      {/* User Protected Routes */}
      <Route
        path="/user/menu"
        element={
          <ProtectedUserRoute>
            <UserLayout>
              <UserMenu />
            </UserLayout>
          </ProtectedUserRoute>
        }
      />

      {/* ADD THIS CART ROUTE */}
      <Route
        path="/user/cart"
        element={
          <ProtectedUserRoute>
            <UserLayout>
              <Cart />
            </UserLayout>
          </ProtectedUserRoute>
        }
      />
    </Routes>
  );
}