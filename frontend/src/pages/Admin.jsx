import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatPrice = (price) =>
  `Rs. ${Number(price).toLocaleString()}`;

const Admin = () => {
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("orders");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const isAdmin = user?.role === "admin";

  const request = async (path, options = {}) => {
    const token = localStorage.getItem("luxetime_token");

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Request failed.");
    }

    return data;
  };

  const loadDashboard = async () => {
    setLoading(true);
    setMessage("");

    try {
      const [statsData, ordersData, productsData] =
        await Promise.all([
          request("/api/admin/stats"),
          request("/api/orders/admin"),
          request("/api/products"),
        ]);

      setStats(statsData.stats);
      setOrders(ordersData.orders || []);
      setProducts(productsData.products || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!isAdmin) {
      setLoading(false);
      return;
    }

    loadDashboard();
  }, [isAdmin, authLoading]);

  const updateStatus = async (orderId, status) => {
    try {
      await request(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setOrders((previous) =>
        previous.map((order) =>
          order._id === orderId
            ? { ...order, status }
            : order
        )
      );

      setMessage("Order status updated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const editProduct = (productId, field, value) => {
    setProducts((previous) =>
      previous.map((product) =>
        product.id === productId
          ? { ...product, [field]: value }
          : product
      )
    );
  };

  const saveProduct = async (product) => {
    try {
      await request(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: product.name,
          price: Number(product.price),
          badge: product.badge || "",
        }),
      });

      setMessage(`${product.name} updated successfully.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#FFFCF8] px-8 pt-40 text-[#7A6A5F]">
          Loading...
        </main>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#FFFCF8] px-6 pt-28">
          <div className="max-w-lg text-center">
            <h1
              className="mb-5 text-4xl text-[#3B2F2F]"
              style={{ fontFamily: "Playfair Display" }}
            >
              Access Restricted
            </h1>

            <p className="mb-8 text-[#7A6A5F]">
              This dashboard is available to administrators only.
            </p>

            <Link
              to="/"
              className="inline-block rounded-full bg-[#3B2F2F] px-8 py-4 text-xs font-semibold tracking-[2px] text-[#E8C9A7]!"
            >
              RETURN HOME
            </Link>
          </div>
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

          {/* Heading */}
          <div className="mb-14">
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#A67C52]" />

              <p className="text-[10px] font-semibold tracking-[4px] text-[#A67C52] uppercase">
                LUXETIME MANAGEMENT
              </p>
            </div>

            <h1
              className="text-5xl text-[#3B2F2F] md:text-7xl"
              style={{ fontFamily: "Playfair Display" }}
            >
              Admin{" "}
              <span className="italic text-[#A67C52]">
                Dashboard
              </span>
            </h1>

            <p className="mt-6 text-[#7A6A5F]">
              Manage demo orders and watch products.
            </p>
          </div>

          {message && (
            <div
              role="status"
              className="mb-8 rounded-xl border border-[#DED2C5] bg-[#F5F1E9] p-5 text-sm text-[#3B2F2F]"
            >
              {message}
            </div>
          )}

          {loading ? (
            <p className="py-16 text-center text-[#7A6A5F]">
              Loading dashboard...
            </p>
          ) : (
            <>
              {/* Dashboard Stats */}
              {stats && (
                <div className="mb-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: "Products",
                      value: stats.products,
                      icon: FiPackage,
                    },
                    {
                      label: "Demo Orders",
                      value: stats.orders,
                      icon: FiShoppingBag,
                    },
                    {
                      label: "Registered Customers",
                      value: stats.customers,
                      icon: FiUsers,
                    },
                    {
                      label: "Completed Demo Order Value",
                      value: formatPrice(stats.demoRevenue),
                      icon: FiTrendingUp,
                    },
                  ].map((card) => {
                    const Icon = card.icon;

                    return (
                      <div
                        key={card.label}
                        className="rounded-2xl border border-[#DED2C5] bg-[#F5F1E9] p-7"
                      >
                        <Icon
                          size={25}
                          className="mb-6 text-[#A67C52]"
                        />

                        <p className="mb-3 text-xs text-[#7A6A5F]">
                          {card.label}
                        </p>

                        <p className="text-2xl font-semibold text-[#3B2F2F]">
                          {card.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tabs */}
              <div className="mb-9 flex gap-6 border-b border-[#DED2C5]">
                {["orders", "products"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 px-4 py-4 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? "border-[#3B2F2F] text-[#3B2F2F]"
                        : "border-transparent text-[#7A6A5F]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Orders Tab */}
              {activeTab === "orders" ? (
                <div className="space-y-6">
                  {orders.length === 0 && (
                    <p className="py-10 text-[#7A6A5F]">
                      No demo orders yet.
                    </p>
                  )}

                  {orders.map((order) => (
                    <article
                      key={order._id}
                      className="rounded-2xl border border-[#DED2C5] bg-[#F5F1E9] p-7"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-6">
                        <div>
                          <p className="mb-3 break-all text-xs text-[#7A6A5F]">
                            #{order._id}
                          </p>

                          <h3 className="text-lg font-medium text-[#3B2F2F]">
                            {order.customer.fullName}
                          </h3>

                          <p className="mt-2 text-sm text-[#7A6A5F]">
                            {order.customer.email}
                          </p>

                          <p className="mt-2 text-xs text-[#7A6A5F]">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString()}
                          </p>

                          <p className="mt-4 font-semibold text-[#3B2F2F]">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>

                        <select
                          aria-label={`Order ${order._id} status`}
                          value={order.status}
                          onChange={(event) =>
                            updateStatus(
                              order._id,
                              event.target.value
                            )
                          }
                          className="rounded-xl border border-[#DED2C5] bg-[#FFFCF8] px-4 py-3 text-sm text-[#3B2F2F] outline-none"
                        >
                          {[
                            "Pending",
                            "Processing",
                            "Completed",
                            "Cancelled",
                          ].map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-7 border-t border-[#DED2C5] pt-5">
                        {order.items.map((item, index) => (
                          <p
                            key={`${item.productId}-${index}`}
                            className="py-1 text-sm text-[#7A6A5F]"
                          >
                            {item.name} × {item.quantity}
                          </p>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                /* Products Tab */
                <div className="grid gap-6 lg:grid-cols-2">
                  {products.map((product) => (
                    <article
                      key={product.id}
                      className="flex flex-col gap-6 rounded-2xl border border-[#DED2C5] bg-[#F5F1E9] p-6 sm:flex-row"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-36 w-36 rounded-xl bg-[#EAE3D9] object-cover"
                      />

                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="mb-2 block text-xs text-[#7A6A5F]">
                            Product Name
                          </label>

                          <input
                            value={product.name}
                            onChange={(event) =>
                              editProduct(
                                product.id,
                                "name",
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-[#DED2C5] bg-[#FFFCF8] px-4 py-3 text-sm text-[#3B2F2F] outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-[#7A6A5F]">
                            Price (Rs.)
                          </label>

                          <input
                            type="number"
                            min="1"
                            value={product.price}
                            onChange={(event) =>
                              editProduct(
                                product.id,
                                "price",
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-[#DED2C5] bg-[#FFFCF8] px-4 py-3 text-sm text-[#3B2F2F] outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-[#7A6A5F]">
                            Badge
                          </label>

                          <input
                            value={product.badge || ""}
                            onChange={(event) =>
                              editProduct(
                                product.id,
                                "badge",
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-[#DED2C5] bg-[#FFFCF8] px-4 py-3 text-sm text-[#3B2F2F] outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => saveProduct(product)}
                          className="rounded-full bg-[#3B2F2F] px-7 py-3 text-xs font-semibold tracking-[1px] text-[#E8C9A7]!"
                        >
                          SAVE CHANGES
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Admin;