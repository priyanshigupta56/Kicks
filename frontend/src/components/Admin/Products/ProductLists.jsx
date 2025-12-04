// src/components/Admin/Products/ProductLists.jsx
import React from "react";
import { products as initialProducts } from "../../../data/products"; 
import api from "../../../api/api";
// localStorage key
const STORAGE_KEY = "kicks_products";

/**
 * ProductLists
 * - Displays products (image, title, price, description)
 * - Add product (modal) with client-side validation (image must be 800x800)
 * - Edit / Delete
 * - Persists to localStorage for demo
 */
export default function ProductLists() {
  const [products, setProducts] = React.useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    // fallback to import data (make sure your data export is named `products`)
    return initialProducts || [];
  });

  const [showModal, setShowModal] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);

  // form state
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [imageFile, setImageFile] = React.useState(null); // raw File
  const [imagePreview, setImagePreview] = React.useState(""); // dataURL
  const [error, setError] = React.useState("");

  // Save products to storage whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {}
  }, [products]);

  // Open modal for Add
  const openAdd = () => {
    clearForm();
    setIsEditing(false);
    setShowModal(true);
  };

  // Open modal for Edit
  const openEdit = (p) => {
    clearForm();
    setIsEditing(true);
    setEditingId(p.id);
    setTitle(p.title || "");
    setDescription(p.description || "");
    setPrice(String(p.price ?? ""));
    setImagePreview(p.image || "");
    setShowModal(true);
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setImageFile(null);
    setImagePreview("");
    setError("");
    setEditingId(null);
  };

  // Delete product
  const handleDelete = (id) => {
    if (!confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Image change -> validate dimensions 800x800
  const handleImageChange = (file) => {
    setError("");
    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    // only allow image types
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = function () {
        if (img.width === 800 && img.height === 800) {
          setImageFile(file);
          setImagePreview(dataUrl);
        } else {
          setError("Image must be exactly 800 x 800 pixels.");
          setImageFile(null);
          setImagePreview("");
        }
      };
      img.onerror = function () {
        setError("Unable to read image.");
        setImageFile(null);
        setImagePreview("");
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

// Submit Add / Edit
const handleSubmit = async (e) => {
  e?.preventDefault();
  setError("");

  if (!title.trim() || !description.trim() || !price) {
    setError("All fields are required.");
    return;
  }

  if (isNaN(Number(price)) || Number(price) <= 0) {
    setError("Price must be a positive number.");
    return;
  }

  if (!imagePreview) {
    setError("Please upload an image (800x800 px).");
    return;
  }

  // Build payload for backend (matches your curl payload)
  const payload = {
    image: imagePreview,
    title: title.trim(),
    description: description.trim(),
    price: String(Number(price)) // your curl used price as string
  };

  try {
    // read token from localStorage (you said you already store it)
    const token = localStorage.getItem("token");
    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      : { "Content-Type": "application/json" };

    // Use the exact endpoint you provided in curl
    const res = await api.post(
      "http://localhost:5000/api/admin/products/",
      payload,
      { headers }
    );

    // update UI locally using response _id if present
    const newProduct = {
      id: res.data?._id || String(Date.now()),
      title,
      description,
      price: Number(price),
      image: imagePreview
    };

    if (isEditing) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? newProduct : p)));
    } else {
      setProducts((prev) => [newProduct, ...prev]);
    }

    setShowModal(false);
    clearForm();
  } catch (err) {
    console.error("Product creation failed: ", err.response || err);
    setError(err.response?.data?.message || "Failed to save product.");
  }
};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Products</h2>
        <button onClick={openAdd} className="px-4 py-2 rounded bg-black text-white text-sm">
          Add Product
        </button>
      </div>

      {/* Products table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img src={p.image} alt={p.title} className="w-20 h-20 object-cover rounded" />
                </td>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">{p.description}</td>
                <td className="px-4 py-3">₹{p.price}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openEdit(p)} className="px-3 py-1 rounded bg-gray-100 text-sm mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1 rounded bg-red-50 text-red-600 text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded shadow p-5">
            <h3 className="text-lg font-semibold mb-3">{isEditing ? "Edit Product" : "Add Product"}</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Product title"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Short description"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Price (INR)</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 1999"
                  type="number"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Image (800 x 800 px)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    handleImageChange(f);
                  }}
                />
                <div className="mt-2 text-xs text-gray-500">Image must be exactly 800 × 800 pixels. All fields are required.</div>

                {imagePreview && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">Preview</div>
                    <img src={imagePreview} alt="preview" className="w-40 h-40 object-cover rounded border" />
                  </div>
                )}
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={() => { setShowModal(false); clearForm(); }} className="px-4 py-2 rounded border">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-black text-white">
                  {isEditing ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
