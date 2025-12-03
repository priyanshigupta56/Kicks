import React from "react";
import { useNavigate } from "react-router-dom";

function StatCard({ title, value, hint }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-500">Welcome back — manage users, products and orders.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="₹ 4,523,189" hint="+20.1%" />
        <StatCard title="Orders" value="2,345" hint="+12.5%" />
        <StatCard title="Products" value="342" hint="+5.2%" />
        <StatCard title="Conversion Rate" value="3.24%" hint="-2.1%" />
      </div>

      {/* Quick actions */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <p className="text-sm text-gray-500">Jump to common admin pages</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 rounded bg-black text-white"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 rounded border border-gray-300"
          >
            Manage Products
          </button>
          <button
            onClick={() => navigate("/admin/orders")}
            className="px-4 py-2 rounded border border-gray-300"
          >
            View Orders
          </button>
        </div>
      </div>

      {/* Charts / placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Sales Overview</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">[Sales chart here]</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Top Categories</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">[Pie chart here]</div>
        </div>
      </div>
    </div>
  );
}