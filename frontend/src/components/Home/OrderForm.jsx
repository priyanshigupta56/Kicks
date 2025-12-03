
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../api/api"; // make sure this file exists (see step 3)

const OrderForm = ({
  isOpen,
  onClose,
  product,
  isLoggedIn = false, // optional prop; localStorage used if not provided
  onRequireLogin = () => {},
  onSuccess = () => {}
}) => {
  // auto-detect login from localStorage if parent didn't pass isLoggedIn
  const token = localStorage.getItem("token");
  const isLoggedInComputed = isLoggedIn || !!token;

  // form fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAddress("");
      setCity("");
      setPincode("");
      setPhone("");
      setQuantity(1);
      setErrors({});
      setSubmitting(false);
      setSuccessMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!address.trim()) e.address = "Address is required.";
    if (!city.trim()) e.city = "City is required.";
    if (!pincode.trim()) e.pincode = "Pincode is required.";
    else if (!/^[0-9]{4,7}$/.test(pincode.trim())) e.pincode = "Enter a valid pincode.";
    if (!phone.trim()) e.phone = "Phone is required.";
    else if (!/^[0-9]{7,15}$/.test(phone.trim())) e.phone = "Enter a valid phone number.";
    if (!quantity || quantity < 1) e.quantity = "Quantity must be at least 1.";
    if (product && product.stock && quantity > product.stock)
      e.quantity = `Only ${product.stock} in stock.`;
    return e;
  };

  const inc = () =>
    setQuantity((q) => {
      const next = q + 1;
      if (product && product.stock) return Math.min(next, product.stock);
      return next;
    });
  const dec = () => setQuantity((q) => Math.max(1, q - 1));

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!isLoggedInComputed) {
      // ask parent to send user to login (or do it here)
      onRequireLogin();
      return;
    }

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);

    // Build the payload matching your backend API
    const payload = {
      product: product?.id || product?._id || null,
      quantity: Number(quantity),
      address: {
        // Your form only has a single address input — map it to houseNo.
        // If you want to collect houseNo/street/state separately later, you can add inputs.
        houseNo: address.trim(),
        street: "",
        city: city.trim(),
        state: "",
        pincode: pincode.trim()
      }
    };

    try {
      // Attach Authorization header explicitly using token from localStorage
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.post("/orders", payload, { headers });
      const returnedOrder = res.data?.order || res.data;

      setSuccessMsg("Order placed successfully.");
      onSuccess(returnedOrder);
    } catch (err) {
      console.error("Order save failed:", err.response || err);
      const msg = err.response?.data?.msg || err.response?.data?.error || err.message || "Order failed";
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        onClose();
        setSuccessMsg("");
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose()} aria-hidden="true" />

      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">
              {product ? `Buy: ${product.name}` : "Place Order"}
            </h3>
            {product && <span className="text-sm text-gray-500"> • ₹{product.price}</span>}
          </div>

          <button onClick={() => onClose()} className="p-2 rounded-md hover:bg-gray-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 max-h-[70vh] overflow-auto">
          {!isLoggedInComputed ? (
            <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-md">
              <p className="text-gray-800 font-medium mb-3">Please login to purchase</p>
              <p className="text-sm text-gray-600 mb-4">
                You must be logged in to place an order. Click the button below to login or register.
              </p>
              <div className="flex gap-3">
                <button onClick={() => onRequireLogin()} className="px-4 py-2 bg-black text-white rounded-md">
                  Login / Register
                </button>
                <button onClick={() => onClose()} className="px-4 py-2 border rounded-md">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none ${errors.address ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-black"}`} />
                  {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none ${errors.city ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-black"}`} />
                  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input value={pincode} onChange={(e) => setPincode(e.target.value)} className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none ${errors.pincode ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-black"}`} />
                  {errors.pincode && <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className={`mt-2 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none ${errors.phone ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-black"}`} />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <div className="mt-2 flex items-center gap-3">
                    <button type="button" onClick={dec} className="w-10 h-10 rounded-md border flex items-center justify-center">−</button>
                    <div className="px-3">{quantity}</div>
                    <button type="button" onClick={inc} className="w-10 h-10 rounded-md border flex items-center justify-center">+</button>
                  </div>
                  {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
                </div>
              </div>

              <div className="pt-4 border-t" />

              <div className="flex items-center justify-between gap-4 mt-4">
                <div>
                  <div className="text-sm text-gray-500">Unit price</div>
                  <div className="text-lg font-semibold">₹{product?.price ?? "0.00"}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-lg font-semibold">₹{(Number(product?.price || 0) * Number(quantity)).toFixed(2)}</div>
                </div>
              </div>

              {errors.submit && <div className="text-red-600 text-sm mt-2">{errors.submit}</div>}

              <div className="flex items-center gap-3 mt-4">
                <button type="submit" disabled={submitting} className="px-6 py-2 rounded-md bg-black text-white hover:opacity-90 disabled:opacity-50">
                  {submitting ? "Placing order..." : "Place Order"}
                </button>

                <button type="button" onClick={() => onClose()} className="px-4 py-2 rounded-md border">
                  Cancel
                </button>
              </div>

              {successMsg && <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md text-green-800">{successMsg}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
