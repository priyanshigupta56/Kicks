// src/components/Auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../utils/Header";
import Footer from "../../utils/Footer";
import api from "../../api/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      // Backend returns { token, user }
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setLoading(false);
      // navigate to redirect or home
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setLoading(false);
      // try to extract server message
      const message =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Login failed";
      setError(message);
      console.error("Login error:", err.response || err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-grow flex items-start justify-center px-4 pt-20 pb-20">
        <div
          className="bg-white w-full max-w-md shadow-lg rounded-xl p-8 border border-gray-200 z-10 mt-6"
          style={{ boxSizing: "border-box" }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Login</h2>
          <p className="text-gray-600 mb-6">
            Enter your email and password to continue.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                to={`/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                className="text-black font-semibold hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
