// src/components/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { products } from "../../data/products"; // adjust path if needed
import Header from "../../utils/Header";
import Footer from "../../utils/Footer";
import api from "../../api/api"; // <-- ADDED: axios instance

// Small helper for formatting price
const formatPrice = (v) => `$${Number(v).toFixed(2)}`;

/**
 * ProductDetails component
 * - Uses route param /product/:id by default
 * - Finds product from products data array, then fetches from backend by id
 *
 * Export: const ProductDetails = ... ; export default ProductDetails;
 */
const ProductDetails = ({ productIdProp = null }) => {
  const params = useParams ? useParams() : {};
  const navigate = useNavigate ? useNavigate() : null;
  const id = productIdProp || params.id;

  // Start with local lookup (same behavior as before), then replace with backend data if available
  const localProduct = products.find((p) => p.id === id || p._id === id);

  // product state now holds the product used by the UI
  const [product, setProduct] = useState(localProduct || null);

  // Keep the same UI states as before
  const [mainImage, setMainImage] = useState(product?.image || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [qty, setQty] = useState(1);

  // Fetch product from backend by id (minimal, read-only)
  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/products/${id}`);
        // backend might return the product object directly or wrapped e.g. { product: {...} }
        const fetched = res.data && (res.data.product || res.data);
        if (!cancelled && fetched) {
          setProduct(fetched);
          // update dependent UI state only if fetched contains those fields
          setMainImage(fetched.image || fetched.images?.[0] || fetched.imageUrl || fetched.image);
          setSelectedColor(fetched.colors?.[0] || "");
          setSelectedSize(fetched.sizes?.[0] || "");
        }
      } catch (err) {
        // silent fail — keep using local data (if any)
        console.error("Failed to fetch product by id:", err);
      }
    };

    fetchProduct();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // If product not found show message (same as before)
  if (!product) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <p className="text-lg text-gray-700">Product not found.</p>
          <Link to="/products" className="mt-4 inline-block text-blue-600">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const oldPrice = product.originalPrice || null;
  const saveAmount = oldPrice ? (oldPrice - product.price).toFixed(2) : null;

  const handleAddToCart = () => {
    // placeholder: replace with your cart logic/store dispatch
    console.log("Add to cart:", { id: product.id, qty, size: selectedSize, color: selectedColor });
    // optionally navigate to cart or show toast
    if (navigate) {
      // navigate("/cart"); // uncomment if you want to redirect
    }
  };

  return (
    <main className="py-12 bg-white">
      <Header />
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="mb-6">
          <Link to="/products" className="text-gray-600 inline-flex items-center gap-2 hover:underline">
            ← Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT: images */}
          <div>
            <div className="rounded-2xl overflow-hidden border border-gray-100">
              <img
                src={mainImage || product.image}
                alt={product.name}
                className="w-full h-[520px] object-cover"
                loading="lazy"
              />
            </div>

            {/* thumbnails */}
            <div className="mt-4 flex gap-3">
              {([product.image, product.image, product.image, product.image]).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`w-[96px] h-[96px] rounded-md overflow-hidden border ${mainImage === img ? "border-gray-900" : "border-gray-200"}`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: details */}
          <div>
            <p className="text-sm text-gray-500">{product.brand}</p>
            <h1 className="mt-2 text-3xl lg:text-4xl font-semibold text-gray-900">{product.name}</h1>

            <div className="mt-4 flex items-center gap-4">
              <div className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</div>
              {oldPrice && (
                <>
                  <div className="text-sm text-gray-400 line-through">{formatPrice(oldPrice)}</div>
                  <div className="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded-full">Save ${saveAmount}</div>
                </>
              )}
            </div>

            <p className="mt-6 text-gray-600">{product.description}</p>

            {/* Color selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-700 mb-2">Color:</p>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-md border ${selectedColor === c ? "border-black" : "border-gray-200"} text-sm`}
                      aria-pressed={selectedColor === c}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-700 mb-2">Size:</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-3 rounded-md border ${selectedSize === s ? "border-black" : "border-gray-200"} text-sm`}
                      aria-pressed={selectedSize === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <p className="text-sm text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="text-lg">{qty}</div>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white px-6 py-4 rounded-lg text-lg font-medium hover:opacity-90"
              >
                Add to Cart
              </button>

              <button className="w-12 h-12 rounded-md border border-gray-200 flex items-center justify-center">
                ♡
              </button>

              <button className="w-12 h-12 rounded-md border border-gray-200 flex items-center justify-center">
                ↗
              </button>
            </div>

            {/* Separator */}
            <div className="my-8 border-t border-gray-100" />

            {/* Small features list */}
            <div className="space-y-6 text-gray-700">
              <div className="flex items-start gap-4">
                <span className="text-2xl">🚚</span>
                <div>
                  <div className="font-medium">Free Shipping</div>
                  <div className="text-sm text-gray-500">On orders over $100</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">↺</span>
                <div>
                  <div className="font-medium">Easy Returns</div>
                  <div className="text-sm text-gray-500">30-day return policy</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">🔒</span>
                <div>
                  <div className="font-medium">Secure Payment</div>
                  <div className="text-sm text-gray-500">100% secure transactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default ProductDetails;