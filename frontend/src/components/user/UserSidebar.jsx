import React from "react";
import { Utensils, ShoppingCart, Package } from "lucide-react";

const UserSidebar = ({ active, setActive, sidebarOpen }) => {
  const menu = [
    { id: "menu", label: "Menu", icon: Utensils, emoji: "🍽" },
    { id: "cart", label: "Cart", icon: ShoppingCart, emoji: "🛒" },
    { id: "orders", label: "My Orders", icon: Package, emoji: "📦" },
  ];

  // ✅ Don't render if sidebar is closed
  if (!sidebarOpen) return null;

  return (
    <aside
      className="fixed top-16 left-0 bg-white h-[calc(100vh-4rem)] shadow-lg transition-all duration-300"
      style={{ width: "260px", borderRight: "1px solid #e9ecef" }}
    >
      <div className="p-4 space-y-2">
        {menu.map((item) => {
          const activeState = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeState ? "text-white" : "text-[#2c3e50] hover:bg-gray-50"
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

export default UserSidebar;