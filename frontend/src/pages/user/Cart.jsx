import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    navigate('/user/checkout');
  };

  // If cart empty
  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#EFEFEF', paddingTop: '2rem' }}>
        <div style={{
          maxWidth: '800px',
          margin: '4rem auto',
          padding: '3rem 2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate('/user/menu')}
            style={{
              backgroundColor: '#EF9651',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EFEFEF', paddingTop: '1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3F7D58' }}>
            Your Cart
          </h1>
          <button
            onClick={() => navigate('/user/menu')}
            style={{
              backgroundColor: 'white',
              color: '#3F7D58',
              border: '2px solid #3F7D58',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
            ← Back to Menu
          </button>
        </div>

        {/* Cart Items */}
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
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.125rem' }}>
                {item.name}
              </h3>

              <p style={{ fontWeight: 'bold', color: '#3F7D58', fontSize: '1rem' }}>
                ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={{
                  backgroundColor: '#EFEFEF',
                  borderRadius: '6px',
                  width: '36px',
                  height: '36px',
                  fontSize: '1.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                -
              </button>

              <span style={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center', fontSize: '1.125rem' }}>
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={{
                  backgroundColor: '#EFEFEF',
                  borderRadius: '6px',
                  width: '36px',
                  height: '36px',
                  fontSize: '1.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                +
              </button>

              <button
                type="button"
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
                }}>
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Total & Checkout */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginTop: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Total:</h3>
            <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#3F7D58' }}>
              ₹{getTotalPrice()}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            style={{
              width: '100%',
              backgroundColor: '#EF9651',
              padding: '1rem',
              borderRadius: '8px',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.125rem'
            }}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
