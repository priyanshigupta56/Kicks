// src/components/Admin/Orders/OrderLists.jsx
import React from "react";

/**
 * OrderLists
 * - Displays: Order ID, User (name & email), Product, Quantity, Address details, Created date/time, Status
 * - Replace placeholder `orders` with API call / props when ready
 */

const sampleOrders = [
  {
    id: "ORD-1001",
    user: { name: "Priyanshi Gupta", email: "priyanshi@example.com" },
    product: "Air Max Elite",
    qty: 1,
    address: {
      line1: "Flat 12, Building A",
      line2: "Sector 5, Gomti Nagar",
      city: "Lucknow",
      state: "UP",
      pincode: "226010",
      country: "India",
    },
    createdAt: "2025-12-03T10:35:00.000Z",
    status: "Pending",
  },
  {
    id: "ORD-1002",
    user: { name: "Chitransh Kumar", email: "chitransh@example.com" },
    product: "CloudRunner Pro",
    qty: 2,
    address: {
      line1: "House 48",
      line2: "Indira Nagar",
      city: "Lucknow",
      state: "UP",
      pincode: "226016",
      country: "India",
    },
    createdAt: "2025-11-20T15:12:00.000Z",
    status: "Completed",
  },
];

const STATUS_OPTIONS = ["Pending", "Processing", "Completed", "Cancelled"];

// format ISO datetime to readable string
function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(); // you can customize locale/options if needed
  } catch {
    return iso;
  }
}

// helper: flatten address into lines
function renderAddress(a) {
  if (!a) return "-";
  const parts = [a.line1, a.line2, `${a.city || ""} ${a.pincode || ""}`, a.state, a.country];
  return parts.filter(Boolean).join(", ");
}

export default function OrderLists() {
  const [orders, setOrders] = React.useState(sampleOrders);

  // change order status locally (replace with API update later)
  const updateStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  // optional: export displayed orders to CSV (simple implementation)
  const exportCSV = () => {
    const headers = ["Order ID","User Name","User Email","Product","Quantity","Address","Created At","Status"];
    const rows = orders.map(o => [
      o.id,
      o.user?.name || "",
      o.user?.email || "",
      o.product || "",
      o.qty || "",
      renderAddress(o.address),
      formatDateTime(o.createdAt),
      o.status || ""
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/\"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded bg-black text-white text-sm"
            type="button"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}

            {orders.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{o.id}</td>

                <td className="px-4 py-3">
                  <div className="font-medium">{o.user?.name || "-"}</div>
                  <div className="text-xs text-gray-500">{o.user?.email || "-"}</div>
                </td>

                <td className="px-4 py-3">{o.product}</td>
                <td className="px-4 py-3">{o.qty}</td>

                <td className="px-4 py-3">
                  <div className="text-sm">{renderAddress(o.address)}</div>
                </td>

                <td className="px-4 py-3">{formatDateTime(o.createdAt)}</td>

                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="px-2 py-1 rounded border text-sm"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
