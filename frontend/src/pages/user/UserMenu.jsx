import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function UserMenu() {
  const navigate = useNavigate();
  const { cart, addToCart, getTotalItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  }, []);

  const menuData = {
    PASTA: [
      { id: 1, name: 'Arabiatta (red sauce)', price: 70 },
      { id: 2, name: 'Arabiatta with cheese', price: 80 },
      { id: 3, name: 'Creamy Alfredo (white sauce)', price: 80 },
      { id: 4, name: 'Creamy Alfredo with cheese', price: 90 },
      { id: 5, name: 'Peri peri mac n cheese', price: 100 }
    ],
    SALAD: [
      { id: 6, name: 'Corn salad', price: 40 },
      { id: 7, name: 'Sprouts salad', price: 40 }
    ],
    SANDWICHES: [
      { id: 8, name: 'Veg sandwich', price: 50 },
      { id: 9, name: 'Cheese chilli sandwich', price: 50 },
      { id: 10, name: 'Cheese corn with mayo', price: 50 },
      { id: 11, name: 'Paneer sandwich', price: 60 }
    ],
    ROLLS: [
      { id: 12, name: 'Veg Roll', price: 50 },
      { id: 13, name: 'Paneer Roll', price: 70 }
    ],
    ['SOUTH INDIAN']: [
      { id: 14, name: 'Plain Dosa', price: 50 },
      { id: 15, name: 'Masala Dosa', price: 60 },
    ]
  };

  const handleAddToCart = (item) => {
    // Check if user is logged in using the correct key
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      if (window.confirm('Please login to add items to your cart. Would you like to login now?')) {
        navigate('/auth');
      }
      return;
    }
    
    addToCart(item);
    // Optional: Show success message
    alert(`${item.name} added to cart!`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGoToCart = () => {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      if (window.confirm('Please login to view your cart. Would you like to login now?')) {
        navigate('/auth');
      }
      return;
    }
    navigate('/user/cart');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EFEFEF' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#3F7D58', 
        color: 'white', 
        padding: '1rem 2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              RVCE Canteen
            </h1>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Browse our delicious menu</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={handleBackToHome}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              ← Back to Home
            </button>
            {!isLoggedIn && (
              <button 
                onClick={() => navigate('/auth')}
                style={{
                  backgroundColor: '#EF9651',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Login / Signup
              </button>
            )}
            <button 
              onClick={handleGoToCart}
              style={{
                backgroundColor: '#EF9651',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                position: 'relative'
              }}
            >
              🛒 Cart ({getTotalItems()})
            </button>
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {Object.entries(menuData).map(([category, items]) => (
          <div key={category} style={{ marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#3F7D58', 
              marginBottom: '1.5rem',
              borderBottom: '3px solid #3F7D58',
              paddingBottom: '0.5rem'
            }}>
              {category}
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {items.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600', 
                      color: '#333',
                      marginBottom: '0.5rem'
                    }}>
                      {item.name}
                    </h3>
                    <p style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      color: '#3F7D58' 
                    }}>
                      ₹{item.price}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    style={{
                      backgroundColor: '#EF9651',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EC5228'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF9651'}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}