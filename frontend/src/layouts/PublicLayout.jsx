import React from "react";
import Navbar from "../components/Navbar";

const PublicLayout = ({ children }) => {
  
  const userToken = localStorage.getItem("userToken");
  const adminToken = localStorage.getItem("adminToken");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const adminData = JSON.parse(localStorage.getItem("adminData"));

  let role = null;
  let name = "";

  if (userToken) {
    role = "user";
    name = userData?.user_name;
  }
  if (adminToken) {
    role = "admin";
    name = adminData?.username;
  }

  return (
    <>
      <Navbar
        sidebarOpen={false}
        setSidebarOpen={() => {}}
        role={role}
        name={name}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
      />

      <main className="pt-20">{children}</main>
    </>
  );
};

export default PublicLayout;
