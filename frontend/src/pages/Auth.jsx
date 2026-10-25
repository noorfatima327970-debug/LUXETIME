import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
  FiArrowLeft,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Auth = ({ mode = "login" }) => {
  const isSignup = mode === "signup";

  const navigate = useNavigate();
  const {
    login,
    register,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      if (isSignup) {
        await register(form);
      } else {
        await login({
          email: form.email,
          password: form.password,
        });
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#F5F1E9] text-[#3B2F2F]">
          Loading...
        </main>
      </>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />

      <main className="flex min-h-screen items-center justify-center bg-[#F5F1E9] px-6 pt-32 pb-20">
        <div className="mx-auto grid w-full max-w-275 overflow-hidden rounded-[28px] border border-[#DED2C5] bg-[#FFFCF8] shadow-[0_25px_80px_rgba(59,47,47,0.07)] lg:grid-cols-2">

          {/* Editorial Panel */}
          <div className="relative hidden min-h-150 flex-col justify-between overflow-hidden bg-[#3B2F2F] p-12 text-[#F5F1E9] lg:flex">
            <div className="pointer-events-none absolute -top-30 -right-30 h-90 w-90 rounded-full border border-[#E8C9A7]/20" />
            <div className="pointer-events-none absolute -bottom-35 -left-30 h-100 w-100 rounded-full border border-[#E8C9A7]/20" />

            <p className="relative text-xs tracking-[4px] text-[#E8C9A7] uppercase">
              LUXETIME MEMBERSHIP
            </p>

            <div className="relative">
              <h2
                className="text-5xl leading-tight"
                style={{ fontFamily: "Playfair Display" }}
              >
                Every Moment
                <br />
                <span className="italic text-[#E8C9A7]">
                  Matters.
                </span>
              </h2>

              <p className="mt-7 max-w-sm text-sm leading-8 text-[#F5F1E9]/65">
                Discover timeless watches, save your favorites,
                and enjoy your personal shopping experience.
              </p>
            </div>

            <span className="relative text-xs tracking-[3px] text-[#E8C9A7]/70">
              TIMELESS BY DESIGN
            </span>
          </div>

          {/* Form */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-7 py-12 sm:px-12 lg:px-14 lg:py-16"
          >
            <Link
              to="/"
              className="mb-12 inline-flex items-center gap-2 text-xs tracking-[1px] text-[#7A6A5F]!"
            >
              <FiArrowLeft />
              BACK TO HOME
            </Link>

            <p className="mb-4 text-[10px] font-semibold tracking-[4px] text-[#A67C52] uppercase">
              {isSignup ? "JOIN LUXETIME" : "WELCOME BACK"}
            </p>

            <h1
              className="text-4xl text-[#3B2F2F] sm:text-5xl"
              style={{ fontFamily: "Playfair Display" }}
            >
              {isSignup ? "Create Account" : "Welcome Back"}
            </h1>

            <p className="mt-5 mb-10 text-sm leading-7 text-[#7A6A5F]">
              {isSignup
                ? "Create your account to enjoy a personalized experience."
                : "Sign in to continue your LUXETIME experience."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {isSignup && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-medium text-[#3B2F2F]"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A67C52]" />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={60}
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-[#DED2C5] bg-[#F5F1E9] py-4 pr-4 pl-12 text-sm text-[#3B2F2F] outline-none focus:border-[#A67C52]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-[#3B2F2F]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A67C52]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#DED2C5] bg-[#F5F1E9] py-4 pr-4 pl-12 text-sm text-[#3B2F2F] outline-none focus:border-[#A67C52]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-[#3B2F2F]"
                >
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A67C52]" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      isSignup ? "new-password" : "current-password"
                    }
                    required
                    minLength={isSignup ? 8 : undefined}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#DED2C5] bg-[#F5F1E9] py-4 pr-12 pl-12 text-sm text-[#3B2F2F] outline-none focus:border-[#A67C52]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-[#7A6A5F]"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="mt-3 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#3B2F2F] px-7 py-4 text-xs font-semibold tracking-[2px] text-[#E8C9A7]! disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "PLEASE WAIT..."
                  : isSignup
                    ? "CREATE ACCOUNT"
                    : "SIGN IN"}

                {!submitting && <FiArrowRight size={18} />}
              </motion.button>
            </form>

            <p className="mt-8 text-center text-sm text-[#7A6A5F]">
              {isSignup
                ? "Already have an account?"
                : "New to LUXETIME?"}{" "}

              <Link
                to={isSignup ? "/login" : "/signup"}
                className="font-semibold text-[#A67C52]!"
              >
                {isSignup ? "Sign In" : "Create Account"}
              </Link>
            </p>

            <div className="mt-9 border-t border-[#DED2C5] pt-7 text-center">
              <Link
                to="/shop"
                className="text-xs tracking-[1px] text-[#7A6A5F]! underline underline-offset-4"
              >
                CONTINUE AS GUEST
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Auth;