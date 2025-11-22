import { NavLink, Outlet, useNavigate } from "react-router-dom";

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const linkClass =
    "px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50";

  const activeClass = "text-adminBlue font-semibold";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-adminBlue">
              Canteen Portal
            </h1>
            <nav className="hidden md:flex gap-2">
              <NavLink
                to="/app/menu"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
                }
              >
                Menu
              </NavLink>
              <NavLink
                to="/app/cart"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
                }
              >
                Cart
              </NavLink>
              <NavLink
                to="/app/orders"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
                }
              >
                My Orders
              </NavLink>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs md:text-sm rounded-lg border px-3 py-1 border-gray-300 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-4 md:py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
