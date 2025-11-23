import React from "react";
import { Utensils, BarChart3, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, emoji: "📊", path: "/admin/dashboard" },
    { id: "menu", label: "Menu Management", icon: Utensils, emoji: "🍽", path: "/admin/menu" },
    { id: "slots", label: "Time Slots", icon: Clock, emoji: "⏱", path: "/admin/slots" },
    { id: "orders", label: "Orders", icon: FileText, emoji: "🧾", path: "/admin/orders" },
  ];

  const handleClick = (item) => {
    setActive(item.id);
    navigate(item.path);
  };

  return (
    <aside
      className="fixed top-16 left-0 bg-white h-[calc(100vh-4rem)] shadow-lg z-40"
      style={{ width: "260px", borderRight: "1px solid #e9ecef" }}
    >
      <div className="p-4 space-y-2 h-full overflow-y-auto">
        {menu.map((item) => {
          const activeState = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:shadow-sm ${
                activeState ? "text-white shadow-sm" : "text-[#2c3e50] hover:bg-gray-50"
              }`}
              style={{
                backgroundColor: activeState ? "#3F7D58" : "transparent",
              }}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default AdminSidebar;