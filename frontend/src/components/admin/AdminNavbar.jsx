import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const date = new Date().toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setCurrentDate(date);

    const name = localStorage.getItem("adminName") || "Admin";
    setAdminName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <div>
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        <p className="text-xs text-gray-500">{currentDate}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          {adminName}
        </span>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-red-500 px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
