import React from "react";
import Navbar from "../components/Navbar";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar
        sidebarOpen={false}
        setSidebarOpen={() => {}}
      />
      <main className="pt-20">{children}</main>
    </>
  );
};

export default PublicLayout;