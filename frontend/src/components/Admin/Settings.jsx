import React from "react";
import { useNavigate } from "react-router-dom";

const ADMINS_KEY = "kicks_admins";
const CURRENT_KEY = "kicks_admin_current";

function readAdmins() {
  try {
    const raw = localStorage.getItem(ADMINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeAdmins(list) {
  try {
    localStorage.setItem(ADMINS_KEY, JSON.stringify(list));
  } catch {}
}
function readCurrent() {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeCurrent(obj) {
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(obj));
  } catch {}
}
function clearCurrent() {
  try {
    localStorage.removeItem(CURRENT_KEY);
  } catch {}
}

export default function Settings() {
  const navigate = useNavigate();
  const current = React.useMemo(() => readCurrent(), []);
  const [siteTitle, setSiteTitle] = React.useState(() => {
    try {
      return localStorage.getItem("kicks_site_title") || "Kicks Admin";
    } catch {
      return "Kicks Admin";
    }
  });

  const [name, setName] = React.useState(current?.name || "");
  const [email, setEmail] = React.useState(current?.email || "");
  const [password, setPassword] = React.useState(""); // plain password input
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    // reset messages 
    setMessage(null);
    setError(null);
  }, [siteTitle, name, email, password]);

  const handleSaveSettings = (e) => {
    e?.preventDefault();
    setMessage(null);
    setError(null);

    if (!siteTitle.trim()) {
      setError("Site title cannot be empty.");
      return;
    }

    try {
      localStorage.setItem("kicks_site_title", siteTitle.trim());
      setMessage("Site settings saved.");
    } catch {
      setError("Failed to save site settings.");
    }
  };

  const handleSaveAccount = async (e) => {
    e?.preventDefault();
    setMessage(null);
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setSaving(true);
    try {
      const admins = readAdmins();
      // find existing admin by email OR by current email
      const matchIndex = admins.findIndex(
        (a) => a.email?.toLowerCase() === (current?.email || "").toLowerCase()
      );

      const record = {
        name: name.trim(),
        email: email.trim(),
        // if password provided
        passwordBase64: password ? btoa(password) : (matchIndex >= 0 ? admins[matchIndex].passwordBase64 : undefined),
      };

      if (matchIndex >= 0) {
        // update existing record
        admins[matchIndex] = { ...admins[matchIndex], ...record };
      } else {
        // If an admin with new email already exists, update that one, else add new
        const emailIndex = admins.findIndex(a => a.email?.toLowerCase() === email.trim().toLowerCase());
        if (emailIndex >= 0) {
          admins[emailIndex] = { ...admins[emailIndex], ...record };
        } else {
          // ensure password provided for new admin
          if (!record.passwordBase64) {
            setError("Provide a password to create a new admin account.");
            setSaving(false);
            return;
          }
          admins.push(record);
        }
      }

      // persist admins & current
      writeAdmins(admins);
      const currentRecord = { name: record.name, email: record.email };
      writeCurrent(currentRecord);

      setMessage("Admin account updated.");
      // clear password field
      setPassword("");
    } catch (err) {
      console.error(err);
      setError("Failed to save admin account.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearCurrent();
    navigate("/admin-login");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-black">Settings</h1>
        <p className="text-sm text-gray-500">Manage site & admin account details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site settings */}
        <div className="bg-white p-5 rounded shadow">
          <h3 className="font-semibold mb-3">Site Settings</h3>
          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Site Title</label>
              <input
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="px-4 py-2 rounded bg-black text-white">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setSiteTitle(localStorage.getItem("kicks_site_title") || "Kicks Admin");
                  setMessage(null);
                  setError(null);
                }}
                className="px-4 py-2 rounded border"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Admin account */}
        <div className="bg-white p-5 rounded shadow">
          <h3 className="font-semibold mb-3">Admin Account</h3>

          <div className="text-sm text-gray-500 mb-3">
            Update the current admin's name, email or password. If a stored admin exists it will be updated. If none exists,
            a new admin record will be created (password required).
          </div>

          <form onSubmit={handleSaveAccount} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm mb-1">Password (leave blank to keep current)</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" type="password" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-black text-white">
                {saving ? "Saving..." : "Save Account"}
              </button>

              <button
                type="button"
                onClick={() => {
                 
                  const cur = readCurrent();
                  setName(cur?.name || "");
                  setEmail(cur?.email || "");
                  setPassword("");
                  setMessage(null);
                  setError(null);
                }}
                className="px-4 py-2 rounded border"
              >
                Reset
              </button>

              <button type="button" onClick={handleLogout} className="px-3 py-2 rounded bg-red-50 text-red-600 ml-auto">
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>

      {(message || error) && (
        <div>
          {message && <div className="text-sm text-green-600">{message}</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
      )}

      <div className="text-xs text-gray-500">
        Note: This admin settings is local-demo only. For production, update credentials and site settings on your secure backend.
      </div>
    </div>
  );
}
