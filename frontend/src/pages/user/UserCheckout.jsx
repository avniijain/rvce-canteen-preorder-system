import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function UserCheckout() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  
  const [timeSlotId, setTimeSlotId] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch time slots from backend
  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      // ✅ FIXED: Use user endpoint (no auth required)
      const res = await fetch('http://localhost:5000/api/user/slots');
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Slots data:', data);
      
      // ✅ Handle both array and object responses
      const slotsArray = Array.isArray(data) ? data : (data.slots || []);
      
      // Filter only active slots
      const activeSlots = slotsArray.filter(slot => slot.is_active === 1);
      setSlots(activeSlots);
      
      if (activeSlots.length === 0) {
        alert('No active time slots available. Please contact admin.');
      }
    } catch (err) {
      console.error('Failed to fetch slots:', err);
      alert('Could not load time slots. Please try again or contact support.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSlotChange = (e) => {
    const slotId = e.target.value;
    const selectedSlot = slots.find(s => s.time_slot_id === parseInt(slotId));
    
    if (selectedSlot) {
      setTimeSlotId(slotId);
    }
  };

  const handlePlaceOrder = async () => {
    if (!timeSlotId) {
      alert('Please select a pickup time slot');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Transform cart items to match backend structure
      const orderItems = cart.map(item => ({
        menu_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const orderData = {
        time_slot_id: parseInt(timeSlotId),
        items: orderItems
      };

      const response = await fetch('http://localhost:5000/api/user/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "paymentSession",
          JSON.stringify({
            orderId: data.order_id,
            amount: getTotalPrice(),
            pickupTime: data.pickup_time
          })
        );
        console.log("Order response from backend:", data);
        navigate('/user/payment', {
      state: {
        orderId: data.order_id,
        pickupTime: data.pickup_time,
        amount: getTotalPrice()
      }
    });
      } else {
        alert('❌ ' + (data.message || 'Failed to place order'));
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('❌ Failed to place order. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
          <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>
            Your cart is empty
          </h2>
          <button 
            onClick={() => navigate('/user/menu')}
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
    <div style={{ minHeight: '100vh', backgroundColor: '#EFEFEF', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3F7D58' }}>Checkout</h1>
          <button 
            onClick={() => navigate('/user/cart')}
            style={{
              backgroundColor: 'white',
              color: '#3F7D58',
              border: '2px solid #3F7D58',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ← Back to Cart
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          {/* Order Details Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#3F7D58' }}>
              Order Details
            </h2>

            {/* Pickup Time Slot */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                Pickup Time Slot *
              </label>
              
              {loadingSlots ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                  Loading available slots...
                </div>
              ) : slots.length === 0 ? (
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffc107',
                  borderRadius: '8px',
                  color: '#856404'
                }}>
                  ⚠️ No time slots available. Please contact the canteen admin.
                </div>
              ) : (
                <select
                  value={timeSlotId}
                  onChange={handleSlotChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select your pickup time</option>
                  {slots.map(slot => (
                    <option key={slot.time_slot_id} value={slot.time_slot_id}>
                      {slot.slot_name} ({slot.start_time} - {slot.end_time})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Important Note */}
            <div style={{
              padding: '1rem',
              backgroundColor: '#fff9e6',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#856404'
            }}>
              <strong>📌 Note:</strong> Please arrive within 15 minutes of your selected pickup time. Orders not collected within this window will be marked as expired.
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: 'fit-content'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#3F7D58' }}>
              Order Summary
            </h2>

            {cart.map(item => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #EFEFEF'
              }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#333', marginBottom: '0.25rem' }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <p style={{ fontWeight: 'bold', color: '#3F7D58' }}>
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}

            <div style={{ 
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '2px solid #3F7D58'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>Total:</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3F7D58' }}>
                  ₹{getTotalPrice()}
                </p>
              </div>

              <button 
                type="button"
                onClick={handlePlaceOrder}
                disabled={isProcessing || !timeSlotId || slots.length === 0}
                style={{
                  width: '100%',
                  backgroundColor: (isProcessing || !timeSlotId || slots.length === 0) ? '#ccc' : '#EF9651',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: (isProcessing || !timeSlotId || slots.length === 0) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  transition: 'opacity 0.2s'
                }}
              >
                {isProcessing ? '⏳ Processing...' : '🛒 Place Order'}
              </button>

              {!timeSlotId && (
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#dc3545', 
                  marginTop: '0.75rem',
                  textAlign: 'center'
                }}>
                  Please select a pickup time slot
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}