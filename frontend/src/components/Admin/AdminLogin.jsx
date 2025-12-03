// File: src/components/AdminLogin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../utils/Header";
    

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
} catch (e) {
// ignore
}
};


const handleLogin = (e) => {
e?.preventDefault();
setError("");


const trimmedEmail = (email || "").trim();
if (!trimmedEmail || !password) {
setError("Please enter both email and password.");
return;
}


// Check fixed admin
if (trimmedEmail === FIXED_ADMIN.email && password === FIXED_ADMIN.password) {
const adminRecord = { name: FIXED_ADMIN.name, email: FIXED_ADMIN.email };
_setCurrentAdmin(adminRecord);
if (typeof onLoginSuccess === "function") onLoginSuccess(adminRecord);
navigate("/admin/dashboard");
return;
}


// If not fixed admin, optionally check localStorage fallback (kept for legacy/demo)
try {
const raw = localStorage.getItem("kicks_admins");
if (raw) {
const admins = JSON.parse(raw);
const pwb64 = btoa(password);
const found = admins.find((a) => a.email === trimmedEmail && a.passwordBase64 === pwb64);
if (found) {
_setCurrentAdmin({ name: found.name, email: found.email });
if (typeof onLoginSuccess === "function") onLoginSuccess(found);
navigate("/admin/dashboard");
return;
}
}
} catch (err) {
// ignore JSON errors
}


setError("Invalid email or password.");
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
autoComplete="username"
/>


<label className="block text-sm text-gray-700 mb-1">Password</label>
<input
type="password"
className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black"
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Your password"
autoComplete="current-password"
/>


<div className="flex items-center justify-between">
<button type="submit" className="px-4 py-2 rounded bg-black text-white font-medium">
Login
</button>
</div>


{error && <div className="mt-3 text-sm text-red-600">{error}</div>}


<div className="mt-4 text-xs text-gray-600">
Note: This panel accepts a fixed admin credential. If you want to change it,
update <code>FIXED_ADMIN</code> in this file.
</div>
</form>
</div>

</div>
);
};


export default AdminLogin;