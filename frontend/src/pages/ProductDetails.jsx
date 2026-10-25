import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FiHeart,
  FiShoppingBag,
  FiMinus,
  FiPlus,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCheck,
  FiArrowUpRight,
  FiArrowLeft,
} from "react-icons/fi";

import { FaStar } from "react-icons/fa";

import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductsContext";

const ProductDetails = () => {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const {
    products,
    loading,
    error,
    refreshProducts,
  } = useProducts();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    clearTimeout(timerRef.current);
  }, [id]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, quantity);
    setAdded(true);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setAdded(false);
    }, 1600);
  };

  if (loading || error || !product) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5F1E9] px-6 text-center">
          <h1
            className="mb-7 text-4xl text-[#3B2F2F] md:text-5xl"
            style={{ fontFamily: "Playfair Display" }}
          >
            {loading
              ? "Loading Timepiece..."
              : error
                ? "Unable to Load Watch"
                : "Product Not Found"}
          </h1>

          {error ? (
            <button
              type="button"
              onClick={refreshProducts}
              className="cursor-pointer rounded-full bg-[#3B2F2F] px-9 py-4 text-[#E8C9A7]!"
            >
              TRY AGAIN
            </button>
          ) : !loading ? (
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 rounded-full bg-[#3B2F2F] px-9 py-4 text-[#E8C9A7]!"
            >
              <FiArrowLeft />
              BACK TO SHOP
            </Link>
          ) : null}
        </main>
      </>
    );
  }

  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 3);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFFCF8] pt-32">

        <div className="mx-auto max-w-350 px-6 lg:px-12">

          {/* Breadcrumb */}
          <div className="mb-12 flex flex-wrap items-center gap-3 text-xs tracking-wide">
            <Link
              to="/"
              className="text-[#7A6A5F]! transition-colors hover:text-[#A67C52]!"
            >
              HOME
            </Link>

            <span className="text-[#C5AD95]">/</span>

            <Link
              to="/shop"
              className="text-[#7A6A5F]! transition-colors hover:text-[#A67C52]!"
            >
              SHOP
            </Link>

            <span className="text-[#C5AD95]">/</span>

            <span className="text-[#3B2F2F]">
              {product.name.toUpperCase()}
            </span>
          </div>

          {/* Main Product */}
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">

            {/* Product Image */}
            <motion.div
              key={`image-${product.id}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 h-32 w-32 border-t border-l border-[#C5AD95]/60" />

              <div className="relative overflow-hidden rounded-[26px] border border-[#D8C8B7]/50 bg-[#EEE7DE] p-3">

                {product.badge && (
                  <span className="absolute top-8 left-8 z-10 rounded-full bg-[#3B2F2F] px-5 py-2 text-[10px] tracking-[2px] text-[#E8C9A7]">
                    {product.badge}
                  </span>
                )}

                <motion.img
                  src={product.image}
                  alt={product.name}
                  whileHover={{ scale: 1.025 }}
                  transition={{ duration: 0.8 }}
                  className="h-112.5 w-full rounded-[18px] object-cover md:h-150"
                />
              </div>

              <div className="absolute -right-4 -bottom-4 h-32 w-32 border-r border-b border-[#C5AD95]/60" />
            </motion.div>

            {/* Product Info */}
            <motion.div
              key={`info-${product.id}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="py-5"
            >
              <div className="mb-7 flex items-center gap-4">
                <span className="h-px w-10 bg-[#A67C52]" />

                <p className="text-[10px] font-semibold tracking-[4px] text-[#A67C52] uppercase">
                  {product.category} Collection
                </p>
              </div>

              <h1
                className="text-5xl leading-[1.1] text-[#3B2F2F] md:text-6xl lg:text-7xl"
                style={{ fontFamily: "Playfair Display" }}
              >
                {product.name}
              </h1>

              <div className="mt-7 flex items-center gap-2">
                {Array.from(
                  { length: product.rating },
                  (_, index) => (
                    <FaStar
                      key={index}
                      className="text-sm text-[#C49A6C]"
                    />
                  )
                )}

                <span className="ml-3 text-sm text-[#7A6A5F]">
                  ({Number(product.rating).toFixed(1)})
                </span>
              </div>

              <p className="mt-9 text-3xl font-semibold tracking-wide text-[#3B2F2F]">
                Rs. {product.price.toLocaleString()}
              </p>

              <div className="my-9 h-px bg-[#DED2C5]" />

              <p className="max-w-lg text-base leading-8 text-[#7A6A5F]">
                {product.description ||
                  `Experience timeless craftsmanship with the ${product.name}.`}
              </p>

              {/* Quantity */}
              <div className="mt-10">
                <p className="mb-5 text-xs font-semibold tracking-[2px] text-[#3B2F2F] uppercase">
                  Select Quantity
                </p>

                <div className="inline-flex items-center overflow-hidden rounded-full border border-[#D6C4B1] bg-[#F5F1E9]">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    aria-label="Decrease quantity"
                    className="cursor-pointer px-5 py-4 text-[#3B2F2F]"
                  >
                    <FiMinus />
                  </button>

                  <span className="min-w-10 text-center font-semibold text-[#3B2F2F]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    aria-label="Increase quantity"
                    className="cursor-pointer px-5 py-4 text-[#3B2F2F]"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-10 flex items-center gap-4">
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-full bg-[#3B2F2F] px-6 py-4 text-xs font-semibold tracking-[2px] text-[#E8C9A7]! shadow-[0_12px_28px_rgba(59,47,47,0.12)]"
                >
                  {added ? (
                    <>
                      <FiCheck size={18} />
                      ADDED TO BAG
                    </>
                  ) : (
                    <>
                      <FiShoppingBag size={18} />
                      ADD TO CART
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Toggle wishlist"
                  className="flex h-13 w-13 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#D6C4B1] bg-[#F5F1E9]"
                >
                  <FiHeart
                    size={21}
                    className={
                      isWishlisted(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-[#3B2F2F]"
                    }
                  />
                </motion.button>
              </div>

              {added && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5"
                >
                  <Link
                    to="/cart"
                    className="text-sm font-medium text-[#A67C52]! underline underline-offset-4"
                  >
                    VIEW SHOPPING BAG →
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Benefits */}
          <div className="mt-24 grid grid-cols-1 gap-8 border-y border-[#DED2C5] py-12 md:grid-cols-3">

            {[
              {
                icon: FiTruck,
                title: "Delivery Information",
                description: "Details available during demo checkout.",
              },
              {
                icon: FiShield,
                title: "Quality Selection",
                description: "A curated collection of elegant timepieces.",
              },
              {
                icon: FiRefreshCw,
                title: "Customer Assistance",
                description: "Explore our demo shopping experience.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F1E9] text-[#A67C52]">
                  <Icon size={21} />
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-[#3B2F2F]">
                    {title}
                  </h3>

                  <p className="text-sm leading-6 text-[#7A6A5F]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Related Watches */}
          {relatedProducts.length > 0 && (
            <section className="py-28">
              <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="mb-5 text-[10px] font-semibold tracking-[4px] text-[#A67C52] uppercase">
                    CONTINUE EXPLORING
                  </p>

                  <h2
                    className="text-4xl text-[#3B2F2F] md:text-6xl"
                    style={{ fontFamily: "Playfair Display" }}
                  >
                    Related{" "}
                    <span className="italic text-[#A67C52]">
                      Watches
                    </span>
                  </h2>
                </div>

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 text-xs font-semibold tracking-[2px] text-[#3B2F2F]!"
                >
                  VIEW ALL WATCHES
                  <FiArrowUpRight size={19} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    className="group"
                  >
                    <div className="overflow-hidden rounded-[22px] border border-[#D8C8B7]/40 bg-[#F0EAE2]">
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        whileHover={{ scale: 1.035 }}
                        transition={{ duration: 0.8 }}
                        className="h-87.5 w-full object-cover"
                      />
                    </div>

                    <p className="mt-6 text-[10px] tracking-[2px] text-[#A67C52] uppercase">
                      {item.category} Collection
                    </p>

                    <h3
                      className="mt-3 text-2xl text-[#3B2F2F]"
                      style={{ fontFamily: "Playfair Display" }}
                    >
                      {item.name}
                    </h3>

                    <p className="mt-3 font-semibold text-[#3B2F2F]">
                      Rs. {item.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default ProductDetails;