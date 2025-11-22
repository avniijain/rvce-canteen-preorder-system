import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  const linkClass =
    "flex items-center px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50";

  const activeClass = "bg-adminBlue text-white hover:bg-adminBlue";

  return (
    <div className="h-full flex flex-col border-r bg-white">
      <div className="px-4 py-4 border-b">
        <h1 className="text-xl font-bold text-adminBlue">Canteen Admin</h1>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/menu"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
          }
        >
          Menu Management
        </NavLink>
        <NavLink
          to="/admin/slots"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
          }
        >
          Slot Management
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
          }
        >
          Orders
        </NavLink>
      </nav>

      <div className="px-4 py-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-red-500 text-white py-2 text-sm font-medium hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
