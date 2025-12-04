
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../utils/Header";
import api from "../../api/api";

const FIXED_ADMIN = {
  email: "admin@kicks.com",
  password: "kicks123",
  name: "Kicks Admin",
};

const AdminLogin = ({ onLoginSuccess } = {}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const _setCurrentAdmin = (admin) => {
    try {
      localStorage.setItem("kicks_admin_current", JSON.stringify(admin));
    } catch {}
  };

  const extractToken = (resData) => {
    if (!resData) return null;
    if (typeof resData === "string") return resData;
    if (resData.token) return resData.token;
    if (resData?.data?.token) return resData.data.token;
    return null;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");

    const trimmedEmail = (email || "").trim();
    if (!trimmedEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // FIXED ADMIN 
    if (trimmedEmail === FIXED_ADMIN.email && password === FIXED_ADMIN.password) {
      const adminRecord = { name: FIXED_ADMIN.name, email: FIXED_ADMIN.email };

      
      localStorage.setItem("token", "STATIC_ADMIN_TOKEN");

      _setCurrentAdmin(adminRecord);
      if (typeof onLoginSuccess === "function") onLoginSuccess(adminRecord);
      navigate("/admin/dashboard");
      return;
    }

    // SERVER LOGIN FOR NORMAL ADMINS
    try {
      const res = await api.post(
        "https://kicks-tkmv.onrender.com/api/admin/login",
        { email: trimmedEmail, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = extractToken(res?.data);
      if (token) {
        localStorage.setItem("token", token);
      }

      const adminRecord = {
        name: res?.data?.user?.name || trimmedEmail,
        email: res?.data?.user?.email || trimmedEmail,
      };

      _setCurrentAdmin(adminRecord);
      if (typeof onLoginSuccess === "function") onLoginSuccess(adminRecord);

      navigate("/admin/dashboard");
      return;
    } catch (err) {
      console.error("Admin login failed:", err?.response || err);
      setError(err?.response?.data?.msg || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Header />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-bold text-black mb-4">Kicks Admin Login</h2>
        <form onSubmit={handleLogin}>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mb-3 bg-white text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@company.com"
          />

          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />

          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 rounded bg-black text-white font-medium">
              Login
            </button>
          </div>

          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
