import React, { useState } from "react";
import { Menu, User, ChevronDown, LogOut, Utensils } from "lucide-react";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ BULLETPROOF: Try-catch parsing
  let user = null;
  let admin = null;
  let userToken = null;
  let adminToken = null;

  try {
    userToken = localStorage.getItem("userToken");
    adminToken = localStorage.getItem("adminToken");

    if (userToken) {
      const userDataRaw = localStorage.getItem("userData");
      if (userDataRaw && userDataRaw !== "undefined") {
        user = JSON.parse(userDataRaw);
      }
    }

    if (adminToken) {
      const adminDataRaw = localStorage.getItem("adminData");
      if (adminDataRaw && adminDataRaw !== "undefined") {
        admin = JSON.parse(adminDataRaw);
      }
    }
  } catch (error) {
    console.error("Navbar parsing error:", error);
    // Clear corrupted data
    localStorage.removeItem("userData");
    localStorage.removeItem("adminData");
  }

  const loggedIn = !!userToken || !!adminToken;
  const name = user?.user_name || admin?.username || "User";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav 
      className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50" 
      style={{ borderBottom: '1px solid #e9ecef' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Toggle + Branding */}
          <div className="flex items-center gap-4">
            {loggedIn && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 lg:hidden rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} style={{ color: '#6c757d' }} />
              </button>
            )}

            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center" 
                style={{ backgroundColor: '#3F7D58' }}
              >
                <Utensils size={24} className="text-white" />
              </div>

              <div className="hidden sm:block">
                <h1 className="text-lg font-bold" style={{ color: '#2c3e50' }}>
                  RVCE Canteen
                </h1>
                <p className="text-xs" style={{ color: '#6c757d' }}>
                  Preorder System
                </p>
              </div>
            </button>
          </div>

          {/* Right Side */}
          {!loggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-50"
                style={{ color: '#3F7D58' }}
              >
                Login
              </button>
              <button
                onClick={() => window.location.href = '/signup'}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90 shadow-sm"
                style={{ backgroundColor: '#3F7D58' }}
              >
                Signup
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: '#3F7D58' }}
                >
                  <User size={18} className="text-white" />
                </div>

                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold" style={{ color: '#2c3e50' }}>
                    {name}
                  </p>
                </div>

                <ChevronDown size={16} style={{ color: '#6c757d' }} className="hidden md:block" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2" 
                  style={{ border: '1px solid #e9ecef' }}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut size={16} style={{ color: '#EC5228' }} />
                    <span className="text-sm font-medium" style={{ color: '#EC5228' }}>
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;