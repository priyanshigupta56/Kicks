import React from "react";

const STORAGE_KEY = "kicks_users";

const SAMPLE_USERS = [
  { id: "u1", name: "Priyanshi Gupta", email: "priyanshi@example.com", phone: "9999999999", status: "Active" },
  { id: "u2", name: "Chitransh Kumar", email: "chitransh@example.com", phone: "8888888888", status: "Blocked" },
  { id: "u3", name: "Riya Sharma", email: "riya@example.com", phone: "7777777777", status: "Active" },
];

function readUsersFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeUsersToStorage(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {}
}

export function getUsers() {
  const stored = readUsersFromStorage();
  return stored ?? SAMPLE_USERS;
}

export function isUserBlocked(email) {
  if (!email) return false;
  const users = readUsersFromStorage() ?? SAMPLE_USERS;
  const u = users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
  return !!(u && u.status === "Blocked");
}


export default function UserLists() {
 
  const [users, setUsers] = React.useState(() => {
    const stored = readUsersFromStorage();
    if (stored && Array.isArray(stored) && stored.length) return stored;
    
    writeUsersToStorage(SAMPLE_USERS);
    return SAMPLE_USERS;
  });

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all"); 
  const [busyId, setBusyId] = React.useState(null); // id being updated 

  
  React.useEffect(() => {
    writeUsersToStorage(users);
  }, [users]);

  const toggleStatus = (id) => {
    const u = users.find((x) => x.id === id);
    if (!u) return;
    const action = u.status === "Active" ? "Block" : "Activate";
    if (!confirm(`${action} user "${u.name}"?`)) return;

    setBusyId(id);
   
    setTimeout(() => {
      setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, status: x.status === "Active" ? "Blocked" : "Active" } : x)));
      setBusyId(null);
    }, 250);
  };

  // Filter + search
  const filtered = users.filter((u) => {
    if (filter === "active" && u.status !== "Active") return false;
    if (filter === "blocked" && u.status !== "Blocked") return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.phone || "").includes(q);
  });

  const handleDelete = (id) => {
    const u = users.find((x) => x.id === id);
    if (!u) return;
    if (!confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    setUsers((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Registered Users</h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border rounded px-2 py-1 bg-white">
            <input
              type="search"
              placeholder="Search name, email or phone"
              className="text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-2 py-1 border rounded text-sm">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No users match your search / filter.
                </td>
              </tr>
            )}

            {filtered.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{u.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{u.phone}</td>

                <td className="px-4 py-3">
                  <span
                    className={
                      "inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium " +
                      (u.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")
                    }
                  >
                    {u.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      disabled={busyId === u.id}
                      className="px-3 py-1 rounded bg-gray-100 text-sm"
                      type="button"
                    >
                      {busyId === u.id ? "..." : u.status === "Active" ? "Block" : "Activate"}
                    </button>

                    <button onClick={() => handleDelete(u.id)} className="px-3 py-1 rounded bg-red-50 text-red-600 text-sm" type="button">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500">
        Note: Blocking a user here updates local state and localStorage. For complete enforcement ensure your backend checks user status on login and when placing orders.
      </div>
    </div>
  );
}
