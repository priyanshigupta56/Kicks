import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { products as productsData } from "../../data/products";
import OrderForm from "../Home/OrderForm";
import api from "../../api/api";


const parseNumericPrice = (price) => {
  if (price == null) return NaN;

  if (typeof price === "object") {
    if ("amount" in price) return Number(price.amount);
    return NaN;
  }

  if (typeof price === "number") return price;

  const cleaned = String(price).replace(/[^0-9.-]+/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
};

const formatPrice = (price, opts = { currencySymbol: "Rs " }) => {
  const num = parseNumericPrice(price);
  if (!Number.isFinite(num)) return null;
  
  return `${opts.currencySymbol}${num.toFixed(2)}`;
};


const Product = ({ product, onBuyNow }) => {
  const imageSrc = product?.image || "https://via.placeholder.com/600x400?text=No+Image";
  const priceText = formatPrice(product?.price) || "Rs N/A";
  const originalPriceText = product?.originalPrice ? formatPrice(product.originalPrice) : null;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={imageSrc}
          alt={product?.name || "Product image"}
          loading="lazy"
          className="w-full h-[300px] object-cover transform transition duration-300 ease-out group-hover:scale-105"
        />

        {product?.originalPrice && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Sale
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-500">{product?.brand}</p>

        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          {product?.name || "Unnamed product"}
        </h3>

        <p className="mt-2 text-sm text-gray-600 min-h-[44px]">
          {product?.description || "No description available."}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">{priceText}</div>
            {originalPriceText && (
              <div className="text-sm text-gray-400 line-through">{originalPriceText}</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/product/${product?.id || product?._id || ""}`}
              className="text-sm px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition"
              aria-label={`View details for ${product?.name}`}
            >
              View Details
            </a>

            <button
              onClick={() => onBuyNow && onBuyNow(product)}
              className="text-sm bg-black text-white px-3 py-2 rounded-md hover:opacity-90 transition"
              aria-label={`Buy ${product?.name} now`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};


const Products = ({ products = productsData, isLoggedIn = false }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const navigate = useNavigate();

  const openOrderFor = (product) => {
    setSelectedProduct(product);
    setOrderOpen(true);
  };

  const closeOrder = () => {
    setOrderOpen(false);
    setSelectedProduct(null);
  };

  const handleRequireLogin = () => {
    const redirectTo = window.location.pathname;
    navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  };

  const handleOrderSuccess = (order) => {
    console.log("Order placed:", order);
  };

  useEffect(() => {
  let cancelled = false;
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/products/", { headers });
      const data = Array.isArray(res.data) ? res.data : res.data?.products || [];
      if (!cancelled) setFetchedProducts(data);
    } catch (err) {
      console.error("getProducts failed:", err);
    }
  };
  fetchProducts();
  return () => { cancelled = true; };
}, []);

  const displayProducts = fetchedProducts && fetchedProducts.length ? fetchedProducts : products;

  return (
    <section id="products" className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Collection</h2>
            <p className="mt-2 text-gray-500">Handpicked favorites for you</p>
          </div>
          <div className="self-center" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.isArray(displayProducts) && displayProducts.length ? (
            displayProducts.map((p) => (
              <Product key={p.id || p._id || JSON.stringify(p)} product={p} onBuyNow={openOrderFor} />
            ))
          ) : (
            <div>No products available.</div>
          )}
        </div>
      </div>

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