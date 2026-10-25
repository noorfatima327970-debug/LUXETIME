import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiArrowLeft,
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiShield,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";

const formatPrice = (price) =>
  `Rs. ${Number(price).toLocaleString()}`;

const Cart = () => {
  const {
    cartItems,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const {
    products,
    loading,
    error,
    refreshProducts,
  } = useProducts();

  const detailedItems = cartItems
    .map((cartItem) => {
      const product = products.find(
        (item) => Number(item.id) === Number(cartItem.id)
      );

      return product
        ? { ...product, quantity: cartItem.quantity }
        : null;
    })
    .filter(Boolean);

  const subtotal = detailedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFFCF8] pt-32 pb-28">
        <div className="mx-auto max-w-350 px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#A67C52]" />

              <p className="text-[10px] font-semibold tracking-[4px] text-[#A67C52] uppercase">
                YOUR SELECTION
              </p>
            </div>

            <h1
              className="text-5xl text-[#3B2F2F] md:text-7xl"
              style={{ fontFamily: "Playfair Display" }}
            >
              Shopping{" "}
              <span className="italic text-[#A67C52]">
                Bag
              </span>
            </h1>

            <p className="mt-6 text-[#7A6A5F]">
              {cartCount}{" "}
              {cartCount === 1 ? "watch" : "watches"} in your bag
            </p>
          </motion.div>

          {loading ? (
            <p className="py-20 text-center text-[#7A6A5F]">
              Loading your shopping bag...
            </p>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="mb-6 text-[#7A6A5F]">{error}</p>

              <button
                type="button"
                onClick={refreshProducts}
                className="rounded-full bg-[#3B2F2F] px-8 py-4 text-[#E8C9A7]!"
              >
                TRY AGAIN
              </button>
            </div>
          ) : detailedItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center rounded-[28px] border border-[#DED2C5]/60 bg-[#F5F1E9] px-6 py-24 text-center"
            >
              <div className="mb-9 flex h-24 w-24 items-center justify-center rounded-full bg-[#EAE3D9]">
                <FiShoppingBag
                  size={38}
                  className="text-[#3B2F2F]"
                />
              </div>

              <h2
                className="mb-5 text-3xl text-[#3B2F2F]"
                style={{ fontFamily: "Playfair Display" }}
              >
                Your Bag Is Empty
              </h2>

              <p className="mb-10 max-w-md leading-8 text-[#7A6A5F]">
                Discover timeless watches and find your next
                favorite timepiece.
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center gap-3 rounded-full bg-[#3B2F2F] px-10 py-4 text-xs font-semibold tracking-[2px] text-[#E8C9A7]!"
              >
                EXPLORE WATCHES
                <FiArrowRight size={18} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between border-b border-[#DED2C5] pb-6">
                  <h2
                    className="text-2xl text-[#3B2F2F]"
                    style={{ fontFamily: "Playfair Display" }}
                  >
                    Selected Timepieces
                  </h2>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="cursor-pointer text-xs tracking-[1px] text-[#A67C52] uppercase"
                  >
                    Clear Bag
                  </button>
                </div>

                <AnimatePresence mode="popLayout">
                  {detailedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                      className="flex flex-col gap-7 border-b border-[#DED2C5] py-8 sm:flex-row"
                    >
                      <Link
                        to={`/product/${item.id}`}
                        className="block w-full shrink-0 overflow-hidden rounded-[18px] bg-[#F0EAE2] sm:w-44"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-60 w-full object-cover sm:h-44"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="mb-3 text-[10px] tracking-[2px] text-[#A67C52] uppercase">
                            {item.category} Collection
                          </p>

                          <Link to={`/product/${item.id}`}>
                            <h3
                              className="mb-4 text-2xl text-[#3B2F2F]"
                              style={{ fontFamily: "Playfair Display" }}
                            >
                              {item.name}
                            </h3>
                          </Link>

                          <p className="font-semibold text-[#3B2F2F]">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
                          <div className="inline-flex items-center overflow-hidden rounded-full border border-[#D6C4B1] bg-[#F5F1E9]">
                            <button
                              type="button"
                              aria-label={`Decrease ${item.name} quantity`}
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="cursor-pointer px-4 py-3 text-[#3B2F2F] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <FiMinus size={15} />
                            </button>

                            <span className="min-w-8 text-center font-medium text-[#3B2F2F]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label={`Increase ${item.name} quantity`}
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.min(20, item.quantity + 1)
                                )
                              }
                              disabled={item.quantity >= 20}
                              className="cursor-pointer px-4 py-3 text-[#3B2F2F] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <FiPlus size={15} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="flex cursor-pointer items-center gap-2 text-sm text-[#A67C52] hover:text-red-600"
                          >
                            <FiTrash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Link
                  to="/shop"
                  className="mt-10 inline-flex items-center gap-3 text-xs font-semibold tracking-[2px] text-[#3B2F2F]!"
                >
                  <FiArrowLeft size={18} />
                  CONTINUE SHOPPING
                </Link>
              </div>

              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="rounded-3xl border border-[#DED2C5]/60 bg-[#F5F1E9] p-8 lg:sticky lg:top-28"
              >
                <p className="mb-5 text-[10px] tracking-[3px] text-[#A67C52] uppercase">
                  YOUR ORDER
                </p>

                <h2
                  className="mb-9 text-3xl text-[#3B2F2F]"
                  style={{ fontFamily: "Playfair Display" }}
                >
                  Order Summary
                </h2>

                <div className="space-y-6 text-sm">
                  <div className="flex justify-between gap-3 text-[#7A6A5F]">
                    <span>Items ({cartCount})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between gap-3 text-[#7A6A5F]">
                    <span>Shipping</span>
                    <span className="text-right">Free</span>
                  </div>

                  <div className="h-px bg-[#D6C4B1]" />

                  <div className="flex justify-between gap-3 text-lg font-semibold text-[#3B2F2F]">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-[#3B2F2F] px-5 py-4 text-center text-xs font-semibold tracking-[1px] text-[#E8C9A7]! transition-transform duration-300 hover:scale-[1.01]"
                >
                  PROCEED TO CHECKOUT
                  <FiArrowRight size={18} />
                </Link>

                <p className="mt-6 text-center text-xs leading-6 text-[#7A6A5F]">
                  A seamless shopping experience.
                </p>

                <div className="mt-8 flex items-center gap-3 border-t border-[#DED2C5] pt-7">
                  <FiShield
                    size={19}
                    className="text-[#A67C52]"
                  />

                  <span className="text-xs text-[#7A6A5F]">
                    Your selection, thoughtfully handled.
                  </span>
                </div>
              </motion.aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Cart;