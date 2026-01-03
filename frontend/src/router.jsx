import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AuthSystem from "./pages/authSystem";
import Dashboard from "./pages/admin/AdminDashboard";
import UserMenu from "./pages/user/UserMenu";
import Cart from "./pages/user/Cart"; 
import UserCheckout from "./pages/user/UserCheckout";
import AdminMenu from "./pages/admin/AdminMenu";
import SlotManagement from "./pages/admin/SlotManagment";
import OrderManagement from "./pages/admin/OrderManagement";
import UserOrders from "./pages/user/UserOrders";
import Payment from "./pages/user/Payment";

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
        path="/signup"
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

      <Route
        path="/admin/slots"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <SlotManagement />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <OrderManagement />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
  path="/user/orders"
  element={
    <ProtectedUserRoute>
      <UserLayout>
        <UserOrders />
      </UserLayout>
    </ProtectedUserRoute>
  }
/>

      <Route
        path="/user/menu"
        element={
          <UserLayout>
            <UserMenu />
          </UserLayout>
        }
      />

      
      {/* User Protected Routes */}

      <Route
        path="/user/checkout"
        element={
          <ProtectedUserRoute>
            <UserLayout>
              <UserCheckout />
            </UserLayout>
          </ProtectedUserRoute>
        }
      />

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
      <Route
        path="/user/payment"
        element={
          <ProtectedUserRoute>
            <UserLayout>
              <Payment />
            </UserLayout>
          </ProtectedUserRoute>
        }
      />
    </Routes>

        
    
  );
}