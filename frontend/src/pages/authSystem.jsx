import React, { useState } from 'react';
import { Eye, EyeOff, UserCircle, ShieldCheck } from 'lucide-react';

const CanteenAuthSystem = () => {
  const [authType, setAuthType] = useState('user');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    userType: 'student'
  });

  const [adminForm, setAdminForm] = useState({
    username: '',
    email: '',
    password: '',
    staffRole: 'staff'
  });

  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAdminChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin 
        ? { username: userForm.username, password: userForm.password }
        : userForm;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(isLogin ? 'Login successful! Redirecting...' : 'Signup successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/api/admin/auth/login' : '/api/admin/auth/signup';
      const payload = isLogin 
        ? { username: adminForm.username, password: adminForm.password }
        : adminForm;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(isLogin ? 'Login successful! Redirecting...' : 'Signup successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: '1px solid #e9ecef' }}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#2c3e50' }}>
              Canteen Management
            </h1>
            <p className="text-sm" style={{ color: '#6c757d' }}>
              Sign in to access your account
            </p>
          </div>

          {/* Auth Type Toggle */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => { setAuthType('user'); setError(''); setSuccess(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                authType === 'user' 
                  ? 'text-white shadow-md' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={authType === 'user' 
                ? { backgroundColor: '#3F7D58' } 
                : { color: '#6c757d', border: '1px solid #dee2e6' }
              }
            >
              <UserCircle size={20} />
              User
            </button>
            <button
              onClick={() => { setAuthType('admin'); setError(''); setSuccess(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                authType === 'admin' 
                  ? 'text-white shadow-md' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={authType === 'admin' 
                ? { backgroundColor: '#3F7D58' } 
                : { color: '#6c757d', border: '1px solid #dee2e6' }
              }
            >
              <ShieldCheck size={20} />
              Admin
            </button>
          </div>

          {/* Login/Signup Toggle */}
          <div className="flex mb-6 rounded-lg p-1" style={{ backgroundColor: '#f8f9fa' }}>
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
                isLogin ? 'bg-white shadow-sm' : ''
              }`}
              style={{ color: isLogin ? '#2c3e50' : '#6c757d' }}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
                !isLogin ? 'bg-white shadow-sm' : ''
              }`}
              style={{ color: !isLogin ? '#2c3e50' : '#6c757d' }}
            >
              Sign Up
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg text-sm text-white" style={{ backgroundColor: '#3F7D58' }}>
              {success}
            </div>
          )}

          {/* User Form */}
          {authType === 'user' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#495057' }}>
                  Username (College ID)
                </label>
                <input
                  type="text"
                  name="username"
                  value={userForm.username}
                  onChange={handleUserChange}
                  className="w-full px-4 py-3 text-gray-800 bg-white rounded-lg outline-none transition placeholder-gray-400"
                  style={{ border: '1px solid #ced4da' }}
                  placeholder="Enter your college ID"
                  onFocus={(e) => e.target.style.borderColor = '#3F7D58'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#495057' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userForm.email}
                      onChange={handleUserChange}
                      className="w-full px-4 py-3 text-gray-800 bg-white rounded-lg outline-none transition placeholder-gray-400"
                      style={{ border: '1px solid #ced4da' }}
                      placeholder="your.email@college.edu"
                      onFocus={(e) => e.target.style.borderColor = '#3F7D58'}
                      onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#495057' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userForm.phone}
                      onChange={handleUserChange}
                      className="w-full px-4 py-3 text-gray-800 bg-white rounded-lg outline-none transition placeholder-gray-400"
                      style={{ border: '1px solid #ced4da' }}
                      placeholder="+91 9876543210"
                      onFocus={(e) => e.target.style.borderColor = '#3F7D58'}
                      onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#495057' }}>
                      User Type
                    </label>
                    <select
                      name="userType"
                      value={userForm.userType}
                      onChange={handleUserChange}
                      className="w-full px-4 py-3 text-gray-800 bg-white rounded-lg outline-none transition"
                      style={{ border: '1px solid #ced4da' }}
                      onFocus={(e) => e.target.style.borderColor = '#3F7D58'}
                      onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                    >
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#495057' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={userForm.password}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 text-gray-800 bg-white rounded-lg outline-none transition pr-12 placeholder-gray-400"
                    style={{ border: '1px solid #ced4da' }}
                    placeholder="Enter your password"
                    onFocus={(e) => e.target.style.borderColor = '#3F7D58'}
                    onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                    style={{ color: '#6c757d' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleUserSubmit}
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#3F7D58' }}
              >
                {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
              </button>
            </div>
          )}

          {/* Admin Form */}
          {authType === 'admin' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#495057' }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={adminForm.username}
                  onChange={handleAdminChange}
                  className="w-full px-4 py-3 text-gray-800 bg-white rounded-lg outline-none transition placeholder-gray-400"
                  style={{ border: '1px solid #ced4da' }}
                  placeholder="Enter admin username"
                  onFocus={(e) => e.target.style.borderColor = '#3F7D58'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#495057' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={adminForm.email}
                      onChange={handleAdminChange}
                      className="w-full px-4 py-3 text-gray-800 bg-white rounded-lg outline-none transition placeholder-gray-400"
                      style={{ border: '1px solid #ced4da' }}
                      placeholder="admin@canteen.edu"
                      onFocus={(e) => e.target.style.borderColor = '#3F7D58'}
                      onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#495057' }}>
                      Staff Role
                    </label>
                    <select
                      name="staffRole"
                      value={adminForm.staffRole}
                      onChange={handleAdminChange}
                      className="w-full px-4 py-3 text-gray-800 bg-white rounded-lg outline-none transition"
                      style={{ border: '1px solid #ced4da' }}
                      onFocus={(e) => e.target.style.borderColor = '#3F7D58'}
                      onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                    >
                      <option value="staff">Staff</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#495057' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={adminForm.password}
                    onChange={handleAdminChange}
                    className="w-full px-4 py-3 text-gray-800 bg-white rounded-lg outline-none transition pr-12 placeholder-gray-400"
                    style={{ border: '1px solid #ced4da' }}
                    placeholder="Enter your password"
                    onFocus={(e) => e.target.style.borderColor = '#3F7D58'}
                    onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                    style={{ color: '#6c757d' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdminSubmit}
                disabled={loading}
                className="w-full text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#3F7D58' }}
              >
                {loading ? 'Processing...' : isLogin ? 'Admin Login' : 'Admin Sign Up'}
              </button>
            </div>
          )}

          {/* Forgot Password */}
          {isLogin && (
            <div className="mt-6 text-center">
              <a href="#" className="text-sm font-medium transition hover:underline" style={{ color: '#3F7D58' }}>
                Forgot Password?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanteenAuthSystem;