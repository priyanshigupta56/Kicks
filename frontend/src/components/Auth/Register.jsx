import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../utils/Header";
import Footer from "../../utils/Footer";
import api from "../../api/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (ev) => {
  ev.preventDefault();
  setError("");
  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match");
    return;
  }
  setLoading(true);
  try {
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      phone: form.phone
    };
    
    const res = await api.post("/auth/register", payload);
    const { token, user } = res.data;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    setLoading(false);
    navigate(redirectTo, { replace: true });
  } catch (err) {
    setLoading(false);
    const msg = err.response?.data?.msg || err.message || "Registration failed";
    setError(msg);
    console.error("Register error:", err.response || err);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-grow flex items-start justify-center px-3 pt-30 pb-20">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
          <p className="text-gray-600 mb-6">Sign up to access all features.</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="border p-3 rounded-lg w-full"
                onChange={handleChange}
                required
                value={form.name}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-3 rounded-lg w-full"
                onChange={handleChange}
                required
                value={form.email}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border p-3 rounded-lg w-full"
                onChange={handleChange}
                required
                value={form.password}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="border p-3 rounded-lg w-full"
                onChange={handleChange}
                required
                value={form.confirmPassword}
              />
            </div>

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              required
              value={form.phone}
            />

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90"
              >
                {loading ? "Creating..." : "Create account"}
              </button>

              <Link to="/login" className="text-sm text-black hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
