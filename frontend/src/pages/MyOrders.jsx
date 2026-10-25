import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FiArrowRight,
  FiPackage,
  FiShoppingBag,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatPrice = (price) =>
  `Rs. ${Number(price).toLocaleString()}`;

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("luxetime_token");

        const response = await fetch(`${API_URL}/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load your orders."
          );
        }

        setOrders(data.orders || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => controller.abort();
  }, [user, authLoading]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFFCF8] pt-32 pb-28">
        <div className="mx-auto max-w-350 px-6 lg:px-12">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-14"
          >
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#A67C52]" />

              <p className="text-[10px] font-semibold tracking-[4px] text-[#A67C52] uppercase">
                YOUR ACCOUNT
              </p>
            </div>

            <h1
              className="text-5xl text-[#3B2F2F] md:text-7xl"
              style={{ fontFamily: "Playfair Display" }}
            >
              My{" "}
              <span className="italic text-[#A67C52]">
                Orders
              </span>
            </h1>

            <p className="mt-6 text-[#7A6A5F]">
              Your LUXETIME demo order history.
            </p>
          </motion.div>

          {/* Loading */}
          {authLoading || loading ? (
            <div className="py-24 text-center">
              <p className="text-[#7A6A5F]">
                Loading your orders...
              </p>
            </div>
          ) : !user ? (
            <div className="rounded-3xl border border-[#DED2C5] bg-[#F5F1E9] px-6 py-20 text-center">
              <FiShoppingBag
                size={42}
                className="mx-auto mb-8 text-[#A67C52]"
              />

              <h2
                className="mb-5 text-3xl text-[#3B2F2F]"
                style={{ fontFamily: "Playfair Display" }}
              >
                Sign In to View Orders
              </h2>

              <p className="mb-9 text-[#7A6A5F]">
                Login to explore your order history.
                Guest checkout is still available without an account.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-3 rounded-full bg-[#3B2F2F] px-9 py-4 text-xs font-semibold tracking-[2px] text-[#E8C9A7]!"
              >
                SIGN IN
                <FiArrowRight size={18} />
              </Link>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-8 text-center">
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl border border-[#DED2C5] bg-[#F5F1E9] px-6 py-20 text-center">
              <FiPackage
                size={44}
                className="mx-auto mb-8 text-[#A67C52]"
              />

              <h2
                className="mb-5 text-3xl text-[#3B2F2F]"
                style={{ fontFamily: "Playfair Display" }}
              >
                No Orders Yet
              </h2>

              <p className="mb-9 text-[#7A6A5F]">
                Your next timeless timepiece is waiting to be discovered.
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center gap-3 rounded-full bg-[#3B2F2F] px-9 py-4 text-xs font-semibold tracking-[2px] text-[#E8C9A7]!"
              >
                EXPLORE WATCHES
                <FiArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="space-y-7">
              {orders.map((order, index) => (
                <motion.article
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                  className="rounded-3xl border border-[#DED2C5] bg-[#F5F1E9] p-6 md:p-9"
                >
                  {/* Order Header */}
                  <div className="mb-7 flex flex-wrap items-start justify-between gap-5 border-b border-[#DED2C5] pb-7">
                    <div>
                      <p className="mb-3 text-[10px] tracking-[2px] text-[#A67C52] uppercase">
                        ORDER REFERENCE
                      </p>

                      <p className="break-all text-sm font-medium text-[#3B2F2F]">
                        #{order._id}
                      </p>

                      <p className="mt-3 text-xs text-[#7A6A5F]">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="rounded-full border border-[#D6C4B1] bg-[#FFFCF8] px-5 py-2 text-xs font-medium text-[#3B2F2F]">
                      {order.status}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-6">
                    {order.items.map((item, itemIndex) => (
                      <div
                        key={`${item.productId}-${itemIndex}`}
                        className="flex items-center gap-5"
                      >
                        <Link
                          to={`/product/${item.productId}`}
                          className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#EAE3D9]"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/product/${item.productId}`}
                          >
                            <h3
                              className="text-xl text-[#3B2F2F]"
                              style={{
                                fontFamily: "Playfair Display",
                              }}
                            >
                              {item.name}
                            </h3>
                          </Link>

                          <p className="mt-2 text-xs text-[#7A6A5F]">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-[#3B2F2F]">
                          {formatPrice(
                            item.price * item.quantity
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-8 flex items-center justify-between border-t border-[#DED2C5] pt-7">
                    <span className="text-sm text-[#7A6A5F]">
                      Order Total
                    </span>

                    <span className="text-xl font-semibold text-[#3B2F2F]">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  <p className="mt-5 text-xs text-[#7A6A5F]">
                    Demo order — no real payment or delivery.
                  </p>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MyOrders;