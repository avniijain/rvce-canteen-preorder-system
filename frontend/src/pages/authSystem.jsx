import React, { useState } from "react";
import { Eye, EyeOff, UserCircle, ShieldCheck, Mail, Lock, User, Phone } from "lucide-react";
import api from "../api/axios";

const AuthSystem = () => {
  const [authType, setAuthType] = useState("user");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    userType: "student",
  });

  const [adminForm, setAdminForm] = useState({
    username: "",
    email: "",
    password: "",
    staffRole: "staff",
  });

  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAdminChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
    setError("");
  };

  // ---------------- USER SUBMIT ----------------
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin ? "/user/auth/login" : "/user/auth/signup";

      const payload = isLogin
        ? { email: userForm.email, password: userForm.password }
        : {
            user_name: userForm.username,
            email: userForm.email,
            phone: userForm.phone,
            user_type: userForm.userType,
            password: userForm.password,
          };

      const { data } = await api.post(endpoint, payload);

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      setSuccess(isLogin ? "Login successful!" : "Signup successful!");

      setTimeout(() => (window.location.href = "/user/menu"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- ADMIN SUBMIT ----------------
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin ? "/admin/auth/login" : "/admin/auth/signup";

      const payload = isLogin
        ? { email: adminForm.email, password: adminForm.password }
        : {
            username: adminForm.username,
            email: adminForm.email,
            password: adminForm.password,
            staff_role: adminForm.staffRole,
          };

      const { data } = await api.post(endpoint, payload);

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data.admin));
      setSuccess(isLogin ? "Login successful!" : "Signup successful!");

      setTimeout(() => (window.location.href = "/admin/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">RVCE Preorder System</h1>
          <p className="text-sm text-gray-500">Login or Create an Account</p>
        </div>

        {/* User/Admin Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => { setAuthType("user"); setError(""); setSuccess(""); }}
            className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg font-medium transition ${
              authType === "user"
                ? "text-white shadow bg-[#3F7D58]"
                : "bg-gray-50 border border-gray-300 text-gray-600"
            }`}
          >
            <UserCircle size={20} />
            User
          </button>

          <button
            onClick={() => { setAuthType("admin"); setError(""); setSuccess(""); }}
            className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg font-medium transition ${
              authType === "admin"
                ? "text-white shadow bg-[#3F7D58]"
                : "bg-gray-50 border border-gray-300 text-gray-600"
            }`}
          >
            <ShieldCheck size={20} />
            Admin
          </button>
        </div>

        {/* Login / Signup */}
        <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-md font-medium transition ${
              isLogin ? "bg-white shadow text-[#3F7D58]" : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-md font-medium transition ${
              !isLogin ? "bg-white shadow text-[#3F7D58]" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 bg-[#3F7D58] text-white rounded-md text-sm">
            {success}
          </div>
        )}

        {/* USER FORM */}
        {authType === "user" && (
          <form className="space-y-4" onSubmit={handleUserSubmit}>
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleUserChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                />
              </div>
            </div>

            {/* Signup Fields */}
            {!isLogin && (
              <>
                {/* Username */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Username (College ID)</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={userForm.username}
                      onChange={handleUserChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={userForm.phone}
                      onChange={handleUserChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700">User Type</label>
                  <select
                    name="userType"
                    value={userForm.userType}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userForm.password}
                  onChange={handleUserChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-lg bg-[#3F7D58] shadow hover:bg-[#355f49] transition"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        )}

        {/* ADMIN FORM */}
        {authType === "admin" && (
          <form className="space-y-4" onSubmit={handleAdminSubmit}>
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={adminForm.email}
                  onChange={handleAdminChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                {/* Username */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={adminForm.username}
                      onChange={handleAdminChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                    />
                  </div>
                </div>

                {/* Staff Role */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Staff Role</label>
                  <select
                    name="staffRole"
                    value={adminForm.staffRole}
                    onChange={handleAdminChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  >
                    <option value="staff">Staff</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={adminForm.password}
                  onChange={handleAdminChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-lg bg-[#3F7D58] shadow hover:bg-[#355f49] transition"
            >
              {loading ? "Processing..." : isLogin ? "Admin Login" : "Admin Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthSystem;
