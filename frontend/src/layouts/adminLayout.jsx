import React, { useState } from "react";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/admin/adminSidebar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <AdminSidebar sidebarOpen={sidebarOpen} />

      <main className={`pt-20 transition-all duration-300 ${
        sidebarOpen ? "pl-[260px]" : "pl-0"
      } p-6`}>
        {children}
      </main>
    </>
  );
};

export default AdminLayout;
