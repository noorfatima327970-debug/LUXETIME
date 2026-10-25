import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiShoppingBag,
  FiShield,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatPrice = (price) =>
  `Rs. ${Number(price).toLocaleString()}`;

const Checkout = () => {
  const { cartItems, clearCart } = useCart();

  const {
    products,
    loading: productsLoading,
    error: productsError,
    refreshProducts,
  } = useProducts();

  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;

    setForm((previous) => ({
      ...previous,
      fullName: previous.fullName || user.name || "",
      email: previous.email || user.email || "",
    }));
  }, [user]);

  const items = useMemo(() => {
    return cartItems
      .map((cartItem) => {
        const product = products.find(
          (item) => Number(item.id) === Number(cartItem.id)
        );

        if (!product) return null;

        return {
          ...product,
          quantity: Number(cartItem.quantity) || 1,
        };
      })
      .filter(Boolean);
  }, [cartItems, products]);

  const subtotal = items.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (submitting || items.length === 0) return;

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("luxetime_token");

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({
          customer: {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
          },
          items: items.map((item) => ({
            productId: Number(item.id),
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to place your order."
        );
      }

      setPlacedOrder(data.order);
      clearCart();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#FFFCF8] px-6 pt-36 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl rounded-3xl border border-[#DED2C5] bg-[#F5F1E9] px-7 py-14 text-center shadow-sm md:px-12"
          >
            <div className="mx-auto mb-8 flex h-22 w-22 items-center justify-center rounded-full bg-[#EAE3D9]">
              <FiCheckCircle
                size={46}
                className="text-[#A67C52]"
              />
            </div>

            <p className="mb-4 text-[10px] font-semibold tracking-[4px] text-[#A67C52] uppercase">
              ORDER CONFIRMED
            </p>

            <h1
              className="mb-6 text-5xl text-[#3B2F2F] md:text-6xl"
              style={{ fontFamily: "Playfair Display" }}
            >
              Thank <span className="italic">You.</span>
            </h1>

            <p className="mx-auto mb-8 max-w-sm text-sm leading-8 text-[#7A6A5F]">
              Your LUXETIME order has been successfully recorded.
              Thank you for exploring our collection.
            </p>

            <div className="mb-8 rounded-2xl border border-[#DED2C5] bg-[#FFFCF8] p-6">
              <p className="mb-3 text-[10px] tracking-[2px] text-[#A67C52] uppercase">
                ORDER REFERENCE
              </p>

              <p className="break-all text-sm font-medium text-[#3B2F2F]">
                {placedOrder._id}
              </p>

              <div className="my-6 h-px bg-[#DED2C5]" />

              <p className="mb-2 text-xs text-[#7A6A5F]">
                Order Total
              </p>

              <p className="text-2xl font-semibold text-[#3B2F2F]">
                {formatPrice(placedOrder.totalAmount)}
              </p>
            </div>

            <p className="mb-9 text-xs leading-7 text-[#7A6A5F]">
              No payment was collected. Orders are not fulfilled
              or shipped through this website.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#3B2F2F] px-8 py-4 text-xs font-semibold tracking-[1px] text-[#E8C9A7]!"
              >
                CONTINUE SHOPPING
                <FiArrowRight size={17} />
              </Link>

              {user && (
                <Link
                  to="/my-orders"
                  className="inline-flex items-center justify-center rounded-full border border-[#3B2F2F] px-8 py-4 text-xs font-semibold tracking-[1px] text-[#3B2F2F]!"
                >
                  MY ORDERS
                </Link>
              )}
            </div>
          </motion.div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFFCF8] pt-32 pb-28">
        <div className="mx-auto max-w-350 px-6 lg:px-12">
          <Link
            to="/cart"
            className="mb-12 inline-flex items-center gap-3 text-xs font-semibold tracking-[2px] text-[#3B2F2F]!"
          >
            <FiArrowLeft size={18} />
            BACK TO BAG
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-14"
          >
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#A67C52]" />

              <p className="text-[10px] font-semibold tracking-[4px] text-[#A67C52] uppercase">
                FINAL STEP
              </p>
            </div>

            <h1
              className="text-5xl text-[#3B2F2F] md:text-7xl"
              style={{ fontFamily: "Playfair Display" }}
            >
              Your{" "}
              <span className="italic text-[#A67C52]">
                Checkout
              </span>
            </h1>

            <p className="mt-6 text-[#7A6A5F]">
              Complete your order. No account required.
            </p>
          </motion.div>

          {productsLoading || authLoading ? (
            <div className="py-24 text-center">
              <p className="text-[#7A6A5F]">
                Preparing your checkout...
              </p>
            </div>
          ) : productsError ? (
            <div className="rounded-2xl bg-[#F5F1E9] px-6 py-16 text-center">
              <p className="mb-6 text-[#7A6A5F]">
                {productsError}
              </p>

              <button
                type="button"
                onClick={refreshProducts}
                className="rounded-full bg-[#3B2F2F] px-8 py-4 text-xs font-semibold tracking-[2px] text-[#E8C9A7]!"
              >
                TRY AGAIN
              </button>
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center rounded-3xl border border-[#DED2C5] bg-[#F5F1E9] px-6 py-24 text-center"
            >
              <div className="mb-8 flex h-22 w-22 items-center justify-center rounded-full bg-[#EAE3D9]">
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

              <p className="mb-9 max-w-md leading-8 text-[#7A6A5F]">
                Add a timeless watch to your bag before
                proceeding to checkout.
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center gap-3 rounded-full bg-[#3B2F2F] px-9 py-4 text-xs font-semibold tracking-[2px] text-[#E8C9A7]!"
              >
                EXPLORE WATCHES
                <FiArrowRight size={18} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-3">
              <form
                onSubmit={placeOrder}
                className="space-y-9 lg:col-span-2"
              >
                <div>
                  <h2
                    className="mb-8 text-3xl text-[#3B2F2F]"
                    style={{ fontFamily: "Playfair Display" }}
                  >
                    Contact & Delivery
                  </h2>

                  <div className="grid gap-6 md:grid-cols-2">
                    {[
                      ["fullName", "Full Name"],
                      ["email", "Email Address"],
                      ["phone", "Phone Number"],
                      ["city", "City"],
                    ].map(([name, label]) => (
                      <div key={name}>
                        <label
                          htmlFor={name}
                          className="mb-3 block text-sm text-[#3B2F2F]"
                        >
                          {label}
                        </label>

                        <input
                          id={name}
                          required
                          name={name}
                          type={
                            name === "email"
                              ? "email"
                              : name === "phone"
                                ? "tel"
                                : "text"
                          }
                          value={form[name]}
                          onChange={handleChange}
                          maxLength={150}
                          autoComplete={
                            name === "fullName"
                              ? "name"
                              : name === "email"
                                ? "email"
                                : name === "phone"
                                  ? "tel"
                                  : "address-level2"
                          }
                          className="w-full rounded-xl border border-[#DED2C5] bg-[#F5F1E9] px-5 py-4 text-sm text-[#3B2F2F] outline-none transition-colors focus:border-[#A67C52]"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="address"
                      className="mb-3 block text-sm text-[#3B2F2F]"
                    >
                      Delivery Address
                    </label>

                    <textarea
                      id="address"
                      required
                      name="address"
                      rows={4}
                      maxLength={500}
                      value={form.address}
                      onChange={handleChange}
                      autoComplete="street-address"
                      className="w-full resize-none rounded-xl border border-[#DED2C5] bg-[#F5F1E9] px-5 py-4 text-sm text-[#3B2F2F] outline-none transition-colors focus:border-[#A67C52]"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#DED2C5] bg-[#F5F1E9] p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <FiShield
                      size={22}
                      className="text-[#A67C52]"
                    />

                    <h3
                      className="text-xl text-[#3B2F2F]"
                      style={{ fontFamily: "Playfair Display" }}
                    >
                      Order Information
                    </h3>
                  </div>

                  <p className="text-sm leading-8 text-[#7A6A5F]">
                    Your order details will be recorded for reference.
                    No payment will be collected, and orders will not
                    be fulfilled or shipped.
                  </p>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 p-5 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-[#3B2F2F] px-6 py-5 text-xs font-semibold tracking-[2px] text-[#E8C9A7]! transition-transform duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "PLACING YOUR ORDER..."
                    : "PLACE ORDER"}

                  {!submitting && (
                    <FiArrowRight size={18} />
                  )}
                </button>

                <p className="text-center text-xs text-[#7A6A5F]">
                  No payment information is required.
                </p>
              </form>

              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl border border-[#DED2C5] bg-[#F5F1E9] p-8 lg:sticky lg:top-28"
              >
                <p className="mb-5 text-[10px] tracking-[3px] text-[#A67C52] uppercase">
                  YOUR SELECTION
                </p>

                <h2
                  className="mb-8 text-3xl text-[#3B2F2F]"
                  style={{ fontFamily: "Playfair Display" }}
                >
                  Order Summary
                </h2>

                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-xl bg-[#EAE3D9] object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#3B2F2F]">
                          {item.name}
                        </p>

                        <p className="mt-2 text-xs text-[#7A6A5F]">
                          Qty: {item.quantity}
                        </p>

                        <p className="mt-2 text-sm text-[#3B2F2F]">
                          {formatPrice(
                            item.price * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-9 border-t border-[#DED2C5] pt-6">
                  <div className="flex justify-between text-sm text-[#7A6A5F]">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="mt-5 flex justify-between text-sm text-[#7A6A5F]">
                    <span>Shipping</span>
                    <span>Not applicable</span>
                  </div>

                  <div className="mt-7 flex justify-between border-t border-[#DED2C5] pt-6 text-lg font-semibold text-[#3B2F2F]">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3 border-t border-[#DED2C5] pt-6">
                  <FiShield
                    size={18}
                    className="text-[#A67C52]"
                  />

                  <span className="text-xs text-[#7A6A5F]">
                    Your order details are securely submitted.
                  </span>
                </div>
              </motion.aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Checkout;