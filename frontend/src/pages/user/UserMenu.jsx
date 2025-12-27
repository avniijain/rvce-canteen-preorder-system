import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function UserMenu() {
  const navigate = useNavigate();
  const { addToCart, getTotalItems } = useCart();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('userToken');

  // Fetch menu from backend
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/menu");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Menu data:", data);
      setMenu(data);
    } catch (err) {
      console.error("Menu fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    // ✅ Check login before adding to cart
    if (!isLoggedIn) {
      if (window.confirm("Please login to add items to cart. Go to login page?")) {
        navigate("/login");
      }
      return;
    }

    addToCart({
      id: item.menu_id,
      name: item.item_name,
      price: item.price,
    });

    alert(`${item.item_name} added to cart`);
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={fetchMenu} style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#3F7D58",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          Retry
        </button>
      </div>
    );
  }

  // Group by category
  const grouped = menu.reduce((acc, item) => {
    const category = item.category || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div style={{ 
      padding: "2rem 1rem", 
      maxWidth: "1200px", 
      margin: "0 auto",
      minHeight: "100vh",
      backgroundColor: "#EFEFEF"
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#3F7D58", marginBottom: "0.5rem" }}>
            Menu
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            {isLoggedIn ? "Browse and order your favorites" : "Login to place orders"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {!isLoggedIn ? (
            <>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  background: "white",
                  color: "#3F7D58",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "2px solid #3F7D58",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600"
                }}
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                style={{
                  background: "#3F7D58",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600"
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/user/cart')}
              style={{
                background: "#3F7D58",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <span>🛒</span>
              <span>Cart ({getTotalItems()})</span>
            </button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      {Object.keys(grouped).length === 0 ? (
        <div style={{
          backgroundColor: "white",
          padding: "3rem",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <p style={{ fontSize: "1.25rem", color: "#666" }}>No menu items available</p>
        </div>
      ) : (
        Object.keys(grouped).map((category) => (
          <div key={category} style={{ marginBottom: "3rem" }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              marginBottom: "1rem",
              color: "#2c3e50",
              borderBottom: "3px solid #3F7D58",
              paddingBottom: "0.5rem",
              display: "inline-block"
            }}>
              {category}
            </h2>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
              gap: "1.5rem",
              marginTop: "1rem"
            }}>
              {grouped[category].map((item) => {
                const outOfStock = Boolean(
  item.is_stock_based === 1 && item.available_qty <= 0
);

                
                return (
                  <div 
                    key={item.menu_id}
                    style={{
                      background: "#fff",
                      padding: "1.5rem",
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      position: "relative",
                      opacity: outOfStock ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!outOfStock) {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                    }}
                  >
                    {outOfStock && (
                      <div style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "600"
                      }}>
                        Out of Stock
                      </div>
                    )}

                    <div>
                      <h3 style={{ 
                        fontSize: "1.125rem", 
                        fontWeight: "600", 
                        marginBottom: "0.5rem",
                        color: "#2c3e50"
                      }}>
                        {item.item_name}
                      </h3>
                      <p style={{ 
                        fontSize: "1.5rem", 
                        fontWeight: "bold", 
                        color: "#3F7D58",
                        marginBottom: "0.5rem"
                      }}>
                        ₹{item.price}
                      </p>
                      {item.is_stock_based === 1 && (
  <p
    style={{
      fontSize: "0.875rem",
      color: item.available_qty > 0 ? "#3F7D58" : "#dc3545",
      fontWeight: "600"
    }}
  >
    {item.available_qty > 0 ? "Available" : "Out of Stock"}
  </p>
)}


                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={outOfStock}
                      style={{
                        background: outOfStock ? "#ccc" : "#EF9651",
                        color: "white",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "none",
                        cursor: outOfStock ? "not-allowed" : "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        marginTop: "1rem",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        if (!outOfStock) e.currentTarget.style.background = "#d67f3d";
                      }}
                      onMouseLeave={(e) => {
                        if (!outOfStock) e.currentTarget.style.background = "#EF9651";
                      }}
                    >
                      {outOfStock ? "Out of Stock" : isLoggedIn ? "Add to Cart +" : "Login to Order"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}