import React, { useState } from "react";
import { Eye, EyeOff, UserCircle, ShieldCheck } from "lucide-react";
import api from "../api/axios";

const authSystem = () => {
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
      const endpoint = isLogin
        ? "/user/auth/login"
        : "/user/auth/signup";

      // correct payload mapping
      const payload = isLogin
  ? { email: userForm.email, password: userForm.password }
  : {
      user_name: userForm.username,
      email: userForm.email,
      phone: userForm.phone,
      user_type: userForm.userType,
      password: userForm.password
    };


      const { data } = await api.post(endpoint, payload);

      localStorage.setItem("userToken", data.token);

      setSuccess(isLogin ? "Login successful!" : "Signup successful!");

      setTimeout(() => {
        window.location.href = "/user/menu";
      }, 1200);
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
      const endpoint = isLogin
        ? "/admin/auth/login"
        : "/admin/auth/signup";

        const payload = isLogin
        ? { email: adminForm.email, password: adminForm.password }
        : {
            username: adminForm.username,
            email: adminForm.email,
            password: adminForm.password,
            staff_role: adminForm.staffRole
          };      

      const { data } = await api.post(endpoint, payload);

      localStorage.setItem("adminToken", data.token);

      setSuccess(isLogin ? "Login successful!" : "Signup successful!");

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9fa]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">RVCE Preorder System</h1>
          <p className="text-sm text-gray-500">Login or Signup</p>
        </div>

        {/* USER / ADMIN Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => { setAuthType("user"); setError(""); setSuccess(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium ${
              authType === "user"
                ? "text-white shadow-md bg-[#3F7D58]"
                : "bg-white text-gray-600 border border-gray-300"
            }`}
          >
            <UserCircle size={20} />
            User
          </button>

          <button
            onClick={() => { setAuthType("admin"); setError(""); setSuccess(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium ${
              authType === "admin"
                ? "text-white shadow-md bg-[#3F7D58]"
                : "bg-white text-gray-600 border border-gray-300"
            }`}
          >
            <ShieldCheck size={20} />
            Admin
          </button>
        </div>

        {/* LOGIN / SIGNUP TOGGLE */}
        <div className="flex mb-6 rounded-lg p-1 bg-gray-100">
          <button
            onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
            className={`flex-1 py-2.5 rounded-md font-medium ${
              isLogin ? "bg-white shadow-sm text-gray-800" : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
            className={`flex-1 py-2.5 rounded-md font-medium ${
              !isLogin ? "bg-white shadow-sm text-gray-800" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 bg-green-600 text-white rounded-md">
            {success}
          </div>
        )}

        {/* USER FORM */}
        {authType === "user" && (
          <form className="space-y-4" onSubmit={handleUserSubmit}>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleUserChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {!isLogin && (
              <>
                {/* Username */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Username (College ID)</label>
                  <input
                    type="text"
                    name="username"
                    value={userForm.username}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userForm.phone}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                {/* User Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700">User Type</label>
                  <select
                    name="userType"
                    value={userForm.userType}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 border rounded-lg"
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
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userForm.password}
                  onChange={handleUserChange}
                  className="w-full px-4 py-3 border rounded-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-lg bg-[#3F7D58]"
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
              <input
                type="email"
                name="email"
                value={adminForm.email}
                onChange={handleAdminChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {!isLogin && (
              <>
                {/* Username */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={adminForm.username}
                    onChange={handleAdminChange}
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                {/* Staff Role */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Staff Role</label>
                  <select
                    name="staffRole"
                    value={adminForm.staffRole}
                    onChange={handleAdminChange}
                    className="w-full px-4 py-3 border rounded-lg"
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
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={adminForm.password}
                  onChange={handleAdminChange}
                  className="w-full px-4 py-3 border rounded-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-lg bg-[#3F7D58]"
            >
              {loading ? "Processing..." : isLogin ? "Admin Login" : "Admin Sign Up"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default authSystem;
