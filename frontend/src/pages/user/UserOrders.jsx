import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, ready, completed

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');

      const response = await fetch(`http://localhost:5000/api/user/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        // Fetch order items for each order
        const ordersWithItems = await Promise.all(
          (data || []).map(async (order) => {
            try {
              const itemsResponse = await fetch(
                `http://localhost:5000/api/user/orders/${order.order_id}`,
                {
                  headers: { 'Authorization': `Bearer ${token}` }
                }
              );
              const orderDetails = await itemsResponse.json();
              return {
                ...order,
                items: orderDetails.items || [],
                specialInstructions: order.special_instructions,
                paymentMethod: order.payment_method || 'cash',
                createdAt: order.order_date
              };
            } catch {
              return {
                ...order,
                items: [],
                specialInstructions: order.special_instructions,
                paymentMethod: order.payment_method || 'cash',
                createdAt: order.order_date
              };
            }
          })
        );
        setOrders(ordersWithItems);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return '#EF9651';
      case 'preparing': return '#3F7D58';
      case 'ready': return '#2d5940';
      case 'completed': return '#666';
      case 'pickedup': return '#2d5940';
      case 'expired': return '#EC5228';
      case 'cancelled': return '#EC5228';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'preparing': return '👨‍🍳';
      case 'ready': return '✅';
      case 'pickedup': return '🎉';
      case 'completed': return '🎉';
      case 'expired': return '❌';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.order_status?.toLowerCase() === filter);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#EFEFEF' }}>
        <header style={{ 
          backgroundColor: '#3F7D58', 
          color: 'white', 
          padding: '1rem 2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Orders</h1>
          </div>
        </header>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <p style={{ fontSize: '1.25rem', color: '#666' }}>Loading orders...</p>
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
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Orders</h1>
          <button 
            onClick={() => navigate('/user/menu')}
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
            Order Again
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {['all', 'pending', 'preparing', 'pickedup', 'expired'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filter === status ? '#3F7D58' : 'white',
                color: filter === status ? 'white' : '#333',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '0.5rem' }}>
              No orders found
            </h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              {filter === 'all' 
                ? "You haven't placed any orders yet." 
                : `No ${filter} orders at the moment.`}
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
                fontWeight: 'bold'
              }}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredOrders.map((order) => (
              <div 
                key={order.order_id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {/* Order Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px solid #EFEFEF',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                      Order ID: {order.order_id?.toString().padStart(4, '0')}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>
                      Pickup Time: {order.pickup_time ? new Date(order.pickup_time).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Not specified'}
                    </p>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    backgroundColor: getStatusColor(order.order_status),
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontWeight: '600'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>
                      {getStatusIcon(order.order_status)}
                    </span>
                    {order.order_status}
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#3F7D58' }}>
                    Items
                  </h3>
                  {order.items?.map((item, index) => (
                    <div 
                      key={index}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                        padding: '0.5rem',
                        backgroundColor: '#FAFAFA',
                        borderRadius: '6px'
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: '600', color: '#333' }}>{item.item_name}</p>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>
                          ₹{item.unit_price} × {item.quantity}
                        </p>
                      </div>
                      <p style={{ fontWeight: 'bold', color: '#3F7D58' }}>
                        ₹{item.subtotal}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '2px solid #EFEFEF',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                      Payment: 💵 Cash
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                      Total Amount
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3F7D58' }}>
                      ₹{order.total_amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}