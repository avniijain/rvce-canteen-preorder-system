import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserSidebar from "../components/user/UserSidebar";

const UserLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ FIX: Determine active menu item from route
  const getInitialActive = () => {
    if (location.pathname.includes("/user/cart")) return "cart";
    if (location.pathname.includes("/user/orders")) return "orders";
    return "menu";
  };

  const [active, setActive] = useState(getInitialActive());

  // ✅ Update active state when route changes
  useEffect(() => {
    if (location.pathname.includes("/user/cart")) setActive("cart");
    else if (location.pathname.includes("/user/orders")) setActive("orders");
    else setActive("menu");
  }, [location.pathname]);

  const handleSetActive = (page) => {
  setActive(page);

  if (page === "menu") {
    navigate("/user/menu");     
  } else if (page === "cart") {
    navigate("/user/cart");
  } else if (page === "orders") {
    navigate("/user/orders");
  }
};



  return (
    <>
      <Navbar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
      />

      <UserSidebar 
        sidebarOpen={sidebarOpen}
        active={active} 
        setActive={handleSetActive}
      />

      <main className={`pt-20 transition-all duration-300 ${
        sidebarOpen ? "pl-[260px]" : "pl-0"
      } p-6`}>
        {children}
      </main>
    </>
  );
};

export default UserLayout;