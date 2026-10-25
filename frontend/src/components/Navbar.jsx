import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiSearch,
  FiHeart,
  FiUser,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.hash]);

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const isSolid = !isHome || scrolled || menuOpen;

  const navbarTextColor = isSolid
    ? "text-[#3B2F2F]!"
    : "text-white!";

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        isSolid
          ? "bg-[#F5F1E9] shadow-[0_2px_20px_rgba(59,47,47,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-22 max-w-350 items-center justify-between px-6 lg:px-12">

        <Link
          to="/"
          className={`font-['Playfair_Display'] text-2xl font-semibold tracking-[0.14em] transition-colors duration-500 md:text-[28px] ${navbarTextColor}`}
        >
          LUXETIME
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative text-sm font-medium tracking-[0.04em] transition-all duration-300 hover:opacity-70 ${navbarTextColor}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className={`flex items-center gap-6 ${navbarTextColor}`}>

          <Link
            to="/shop"
            aria-label="Search watches"
            className={`hidden transition-transform duration-300 hover:scale-105 sm:block ${navbarTextColor}`}
          >
            <FiSearch size={21} />
          </Link>

          <Link
            to="/wishlist"
            aria-label={`Wishlist with ${wishlistCount} watches`}
            className={`relative hidden transition-transform duration-300 hover:scale-105 sm:block ${navbarTextColor}`}
          >
            <FiHeart size={21} />

            {wishlistCount > 0 && (
              <span className="absolute -top-3 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A67C52] px-1 text-[10px] font-semibold text-white!">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <div className="relative hidden sm:block">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setAccountOpen((prev) => !prev)}
                  aria-label="Account menu"
                  aria-expanded={accountOpen}
                  className="cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  <FiUser size={21} />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-11 right-0 w-56 rounded-xl border border-[#DED2C5] bg-[#FFFCF8] p-4 shadow-lg"
                    >
                      <p className="truncate text-sm font-semibold text-[#3B2F2F]">
                        {user.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#7A6A5F]">
                        {user.email}
                      </p>

                      <div className="my-4 h-px bg-[#DED2C5]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-3 text-sm text-[#3B2F2F]"
                      >
                        <FiLogOut size={17} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                to="/login"
                aria-label="Login or create account"
                className={navbarTextColor}
              >
                <FiUser size={21} />
              </Link>
            )}
          </div>

          <Link
            to="/cart"
            aria-label={`Shopping bag with ${cartCount} items`}
            className={`relative transition-transform duration-300 hover:scale-105 ${navbarTextColor}`}
          >
            <FiShoppingBag size={22} />

            <AnimatePresence mode="wait">
              <motion.span
                key={cartCount}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-3 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A67C52] px-1 text-[10px] font-semibold text-white!"
              >
                {cartCount}
              </motion.span>
            </AnimatePresence>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="cursor-pointer lg:hidden"
          >
            {menuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden border-t border-[#E5D9CA] bg-[#F5F1E9] lg:hidden"
          >
            <nav className="flex flex-col gap-6 px-6 py-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-[#3B2F2F]!"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-sm text-[#3B2F2F]!"
              >
                <FiHeart size={19} />
                Wishlist ({wishlistCount})
              </Link>

              {user ? (
                <div className="border-t border-[#DED2C5] pt-5">
                  <p className="mb-4 text-sm font-semibold text-[#3B2F2F]">
                    {user.name}
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-sm text-[#3B2F2F]"
                  >
                    <FiLogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-sm text-[#3B2F2F]!"
                >
                  <FiUser size={19} />
                  Login / Signup
                </Link>
              )}

              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-sm text-[#3B2F2F]!"
              >
                <FiShoppingBag size={19} />
                Shopping Bag ({cartCount})
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;