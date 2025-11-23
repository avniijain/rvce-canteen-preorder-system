import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    navigate('/user/checkout');
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#EFEFEF' }}>
        <header style={{ 
          backgroundColor: '#3F7D58', 
          color: 'white', 
          padding: '1rem 2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your Cart</h1>
          </div>
        </header>
        
        <div style={{ 
          maxWidth: '800px', 
          margin: '4rem auto', 
          padding: '3rem 2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>
            Your cart is empty
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Add some delicious items from our menu!
          </p>
          <button 
            onClick={() => navigate('/menu')}
            style={{
              backgroundColor: '#EF9651',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EFEFEF' }}>
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
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your Cart</h1>
          <button 
            onClick={() => navigate('/menu')}
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
            ← Back to Menu
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        {cart.map((item) => (
          <div 
            key={item.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: '1', minWidth: '200px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                {item.name}
              </h3>
              <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#3F7D58' }}>
                ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={{
                  backgroundColor: '#EFEFEF',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}
              >
                -
              </button>
              <span style={{ 
                minWidth: '40px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                fontSize: '1.125rem'
              }}>
                {item.quantity}
              </span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={{
                  backgroundColor: '#EFEFEF',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}
              >
                +
              </button>
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{
                  backgroundColor: '#EC5228',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginLeft: '0.5rem'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Total */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginTop: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Total:</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3F7D58' }}>
              ₹{getTotalPrice()}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleCheckout}
              style={{
                flex: '1',
                minWidth: '200px',
                backgroundColor: '#EF9651',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.125rem'
              }}
            >
              Proceed to Checkout
            </button>
            <button 
              onClick={clearCart}
              style={{
                backgroundColor: '#EFEFEF',
                color: '#EC5228',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}