// src/components/Products.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { products as productsData } from "../../data/products";
// Adjust the import path to where your OrderForm actually lives.
// If you placed OrderForm at src/components/OrderForm.jsx use: "../OrderForm"
import OrderForm from "../Home/OrderForm"; // <- update this path if needed
import api from "../../api/api"; // <-- ADDED: axios instance (baseURL should be http://localhost:5000/api)

/**
 * Product card (declared BEFORE Products to avoid "Product is not defined")
 * Accepts onBuyNow(product) prop
 */
const Product = ({ product, onBuyNow }) => {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-[300px] object-cover transform transition duration-300 ease-out group-hover:scale-105"
        />

        {product.originalPrice && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Sale
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-500">{product.brand}</p>

        <h3 className="mt-2 text-lg font-semibold text-gray-900">{product.name}</h3>

        <p className="mt-2 text-sm text-gray-600 min-h-[44px]">{product.description}</p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">Rs{product.price.toFixed(2)}</div>
            {product.originalPrice && (
              <div className="text-sm text-gray-400 line-through">
                Rs {product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* convert to <Link> if you use react-router */}
            <a
              href={`/product/${product.id}`}
              className="text-sm px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition"
              aria-label={`View details for ${product.name}`}
            >
              View Details
            </a>

            <button
              onClick={() => onBuyNow && onBuyNow(product)}
              className="text-sm bg-black text-white px-3 py-2 rounded-md hover:opacity-90 transition"
              aria-label={`Buy ${product.name} now`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

/**
 * Products list (parent)
 * - keeps single OrderForm modal instance
 */
const Products = ({ products = productsData /* fallback */, isLoggedIn = false }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [fetchedProducts, setFetchedProducts] = useState([]); // <-- ADDED: stores API results
  const navigate = useNavigate();

  const openOrderFor = (product) => {
    setSelectedProduct(product);
    setOrderOpen(true);
  };

  const closeOrder = () => {
    setOrderOpen(false);
    setSelectedProduct(null);
  };

  // If OrderForm asks to require login, redirect to /login and return here after login
  const handleRequireLogin = () => {
    const redirectTo = window.location.pathname; // current page
    navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  };

  // Called when order is successfully placed
  const handleOrderSuccess = (order) => {
    console.log("Order placed:", order);
    // Optionally navigate to /orders or show a toast
    // navigate('/orders');
  };

  // Minimal fetch: GET /api/products/ on mount
  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/");
        // Expecting res.data to be an array or an object with .products
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        if (!cancelled) setFetchedProducts(data);
      } catch (err) {
        // silent fail — keep using the provided `products` prop or local data
        console.error("getProducts failed:", err);
      }
    };
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  // Use fetchedProducts if available, otherwise fall back to the products prop
  const displayProducts = fetchedProducts && fetchedProducts.length ? fetchedProducts : products;

  return (
    <section id="products" className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Collection</h2>
            <p className="mt-2 text-gray-500">Handpicked favorites for you</p>
          </div>

          <div className="self-center">
            {/* <a href="/products" className="text-sm text-gray-900 font-medium flex items-center gap-2">
              View All <span aria-hidden>→</span>
            </a> */}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((p) => (
            <Product key={p.id || p._id} product={p} onBuyNow={openOrderFor} />
          ))}
        </div>
      </div>

      {/* Order modal - uses the consistent state names above */}
      <OrderForm
        isOpen={orderOpen}
        onClose={closeOrder}
        product={selectedProduct}
        onRequireLogin={handleRequireLogin}
        onSuccess={handleOrderSuccess}
      />
    </section>
  );
};

export default Products;