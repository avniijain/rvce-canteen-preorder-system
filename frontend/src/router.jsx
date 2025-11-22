import { Navigate, useRoutes } from "react-router-dom";

import AdminLayout from "./layouts/adminLayout";
import UserLayout from "./layouts/userLayout";

import AdminLogin from "./pages/admin/adminLogin";
import Dashboard from "./pages/admin/Dashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import SlotManagement from "./pages/admin/SlotManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";

import UserLogin from "./pages/user/UserLogin";
import UserSignup from "./pages/user/UserSignup";
import MenuView from "./pages/user/MenuView";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import UserOrdersPage from "./pages/user/UserOrdersPage";


// -----------------------------
// PROTECTED ROUTES
// -----------------------------

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


// -----------------------------
// ROUTES
// -----------------------------

export default function AppRoutes() {
  const routes = useRoutes([

    // Default redirect
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },

    // USER AUTH
    {
      path: "/login",
      element: <UserLogin />,
    },
    {
      path: "/signup",
      element: <UserSignup />,
    },

    // USER PANEL
    {
      path: "/app",
      element: (
        <UserProtectedRoute>
          <UserLayout />
        </UserProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="menu" replace /> },
        { path: "menu", element: <MenuView /> },
        { path: "cart", element: <CartPage /> },
        { path: "checkout", element: <CheckoutPage /> },
        { path: "orders", element: <UserOrdersPage /> },
      ],
    },

    // ADMIN LOGIN
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },

    // ADMIN PANEL
    {
      path: "/admin",
      element: (
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "menu", element: <MenuManagement /> },
        { path: "slots", element: <SlotManagement /> },
        { path: "orders", element: <OrdersManagement /> },
      ],
    },

    // 404
    {
      path: "*",
      element: <div className="p-8">Page Not Found</div>,
    },

  ]);

  return routes;
}
