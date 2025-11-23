import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getInitialActive = () => {
  if (location.pathname.includes("/admin/menu")) return "menu";
  if (location.pathname.includes("/admin/slots")) return "slots";
  if (location.pathname.includes("/admin/orders")) return "orders";
  return "dashboard"; // default
};

  const [active, setActive] = useState(getInitialActive());

  useEffect(() => {
    if (location.pathname.includes("/admin/menu")) setActive("menu");
    else if (location.pathname.includes("/admin/slots")) setActive("slots");
    else if (location.pathname.includes("/admin/orders")) setActive("orders");
    else setActive("dashboard");
  }, [location.pathname]);


  return (
    <>
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role="admin"               // REQUIRED for navbar login/logout UI
        name="Admin"               // will later use stored admin name
      />

      <AdminSidebar
        active={active}            // REQUIRED
        setActive={setActive}      // REQUIRED
      />

      <main
        className={`pt-20 transition-all duration-300 ${
          sidebarOpen ? "pl-[260px]" : "pl-0"
        } p-6`}
      >
        {children}
      </main>
    </>
  );
};

export default AdminLayout;
