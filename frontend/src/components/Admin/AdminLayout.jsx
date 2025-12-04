
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User } from "lucide-react"; 
import logo from "../../assets/img/logo2.png";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white min-h-screen hidden md:block">
        <div className="p-6 border-b border-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded overflow-hidden flex items-center justify-center bg-white/10">
              <img src={logo} alt="Kicks Logo" className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="font-semibold">KICKS</div>
              <div className="text-xs text-white/60">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="p-4 flex flex-col justify-between h-[calc(100vh-96px)]">
          <div className="space-y-1">
            <SidebarLink to="/admin/dashboard" label="Dashboard" />
            <SidebarLink to="/admin/users" label="Users" />
            <SidebarLink to="/admin/products" label="Products" />
            <SidebarLink to="/admin/orders" label="Orders" />
            <SidebarLink to="/admin/settings" label="Settings" />
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-white/80 hover:bg-white/5 transition-colors"
            >
              <span className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-sm">←</span>
              <span>Back to Store</span>
            </NavLink>
          </div>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        <Topbar onProfileClick={() => navigate("/admin-login")} />
        <main className="p-6 bg-gray-50 min-h-screen">{children}</main>
      </div>
    </div>
  );
}

/* Sidebar link  */
function SidebarLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors " +
        (isActive
          ? "bg-white/10 text-white font-medium"
          : "text-white/80 hover:bg-white/5")
      }
    >
      <span className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-sm">{label[0]}</span>
      <span>{label}</span>
    </NavLink>
  );
}

/* Topbar  */
function Topbar({ onProfileClick }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-black">Admin</h1>
        <p className="text-sm text-gray-500 hidden md:block">Manage users, products and orders</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <input
            type="search"
            placeholder="Search users, orders, products..."
            className="px-3 py-1 border rounded text-sm w-72"
          />
        </div>

        <button
          aria-label="Profile"
          type="button"
          onClick={onProfileClick}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <User size={18} />
        </button>
      </div>
    </div>
  );
}
