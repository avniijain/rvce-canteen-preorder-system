import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const isUser = localStorage.getItem("userToken");
  const isAdmin = localStorage.getItem("adminToken");

 const handleGetStarted = () => {
  if (isAdmin) return navigate('/admin/dashboard');
  if (isUser) return navigate('/user/menu');
  return navigate('/login');
};

const handleViewMenu = () => {
  if (isAdmin) return navigate('/admin/menu');
  return navigate('/user/menu');
};

  

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EFEFEF' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3F7D58 0%, #2d5940 100%)', 
        color: 'white',
        padding: '4rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            RVCE Canteen Pre-Order System
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', opacity: 0.9 }}>
            Skip the queue. Pre-order your meals. Save time.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={handleGetStarted}
              style={{
                backgroundColor: '#EF9651',
                color: 'white',
                fontWeight: 'bold',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.125rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Get Started →
            </button>
            <button 
              onClick={handleViewMenu}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                fontWeight: 'bold',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.125rem',
                border: '2px solid white',
                cursor: 'pointer'
              }}
            >
              View Menu
            </button>
          </div>
        </div>
        
        {/* Canteen Image */}
        <div style={{ maxWidth: '1000px', margin: '3rem auto 0', padding: '0 1rem' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{ padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: '#3F7D58' }}>
            How It Works
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.125rem' }}>
            Order your favorite meals in just 3 simple steps
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Step 1 */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: '#3F7D58', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem'
              }}>
                🛒
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.75rem', color: '#3F7D58' }}>
                Browse & Order
              </h3>
              <p style={{ color: '#666', textAlign: 'center' }}>
                Browse through our delicious menu and add items to your cart. Select your preferred time slot for pickup.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: '#EF9651', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem'
              }}>
                ⏱️
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.75rem', color: '#EF9651' }}>
                Track Preparation
              </h3>
              <p style={{ color: '#666', textAlign: 'center' }}>
                Get real-time updates on your order status. Know exactly when your food is being prepared.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: '#EC5228', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem'
              }}>
                ✅
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.75rem', color: '#EC5228' }}>
                Quick Pickup
              </h3>
              <p style={{ color: '#666', textAlign: 'center' }}>
                Skip the long queues! Pick up your order at your scheduled time slot and enjoy your meal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Students Love Us Section */}
      <div style={{ backgroundColor: 'white', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: '#3F7D58' }}>
            Why Students Love Us
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.125rem' }}>
            Join hundreds of satisfied students saving time every day
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚡</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#3F7D58' }}>Save Time</h3>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>
                No more waiting in long queues during breaks
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📱</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#3F7D58' }}>Easy to Use</h3>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>
                Simple interface, order in seconds
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🍽️</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#3F7D58' }}>Fresh Food</h3>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>
                Your order prepared fresh just before pickup
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#3F7D58' }}>Track Orders</h3>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>
                Real-time updates on order preparation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        background: 'linear-gradient(90deg, #3F7D58 0%, #2d5940 100%)', 
        color: 'white', 
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>👥</div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Ready to Save Time?
        </h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
          Join the smart way to order food at RVCE canteen
        </p>
        <button 
          onClick={handleGetStarted}
          style={{
            backgroundColor: '#EF9651',
            color: 'white',
            fontWeight: 'bold',
            padding: '1rem 3rem',
            borderRadius: '8px',
            fontSize: '1.125rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Start Ordering Now →
        </button>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2d5940', color: 'white', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem' }}>RVCE Canteen</h3>
              <p style={{ color: '#ddd', fontSize: '0.875rem' }}>
                Pre-order system designed to make your campus dining experience seamless and efficient.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <button onClick={handleGetStarted} style={{ background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', textAlign: 'left' }}>
                  User Login
                </button>
                <button onClick={handleGetStarted} style={{ background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', textAlign: 'left' }}>
                  Admin Login
                </button>
                <button onClick={handleViewMenu} style={{ background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', textAlign: 'left' }}>
                  View Menu
                </button>
              </div>
            </div>
            
            <div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem' }}>Contact</h3>
              <p style={{ color: '#ddd', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                RVCE Campus Canteen<br />
                Bengaluru, Karnataka
              </p>
              <p style={{ color: '#ddd', fontSize: '0.875rem' }}>
                Email: canteen@rvce.edu.in
              </p>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid #4a6b57', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#ddd' }}>
            <p>&copy; 2024 RVCE Canteen Pre-Order System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}