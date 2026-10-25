import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";

import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiArrowUpRight,
  FiSliders,
  FiX,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";

import { FaStar } from "react-icons/fa";

import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductsContext";

import featuredWatch from "../assets/watch2.jpg";

const categories = ["All", "Men", "Women", "Luxury"];

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [added, setAdded] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="group"
    >
      {/* Product Image */}
      <div className="relative h-85 overflow-hidden rounded-[20px] border border-[#D8C8B7]/40 bg-[#F0EAE2]">

        {/* Product Number */}
        <span className="absolute bottom-5 left-5 z-10 text-[10px] tracking-[3px] text-[#3B2F2F]/45">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-4 left-4 z-20 rounded-full bg-[#3B2F2F] px-4 py-2 text-[9px] font-medium tracking-[1.5px] text-[#E8C9A7]">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={`Toggle wishlist for ${product.name}`}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D8C8B7]/50 bg-[#FFFCF8]/95 shadow-sm transition-transform duration-300 hover:scale-105"
        >
          <FiHeart
            size={18}
            className={
              isWishlisted(product.id)
                ? "fill-red-500 text-red-500"
                : "text-[#3B2F2F]"
            }
          />
        </button>

        {/* Clickable Image */}
        <Link
          to={`/product/${product.id}`}
          aria-label={`View ${product.name}`}
          className="block h-full w-full"
        >
          <motion.img
            src={product.image}
            alt={product.name}
            whileHover={{ scale: 1.035 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="h-full w-full object-cover"
          />
        </Link>

        {/* Add to Cart */}
        <div className="absolute right-4 bottom-4 left-4 z-20 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#3B2F2F] px-5 py-3.5 text-[11px] font-medium tracking-[1.5px] text-[#E8C9A7]! shadow-[0_10px_25px_rgba(59,47,47,0.15)] transition-transform duration-300 hover:scale-102"
          >
            {added ? (
              <>
                <FiCheck size={17} />
                ADDED TO BAG
              </>
            ) : (
              <>
                <FiShoppingBag size={17} />
                ADD TO CART
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="px-1 pt-6">

        <p className="mb-3 text-[10px] font-medium tracking-[2.5px] text-[#A67C52] uppercase">
          {product.category} Collection
        </p>

        <Link to={`/product/${product.id}`}>
          <h3
            className="mb-3 text-[24px] leading-snug text-[#3B2F2F] transition-colors duration-300 hover:text-[#A67C52]"
            style={{ fontFamily: "Playfair Display" }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mb-4 flex items-center gap-1">
          {Array.from(
            { length: product.rating },
            (_, index) => (
              <FaStar
                key={index}
                className="text-[11px] text-[#C49A6C]"
              />
            )
          )}

          <span className="ml-2 text-xs text-[#7A6A5F]">
            ({Number(product.rating).toFixed(1)})
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-[#DED2C5]/70 pt-4">
          <p className="text-lg font-semibold tracking-wide text-[#3B2F2F]">
            Rs. {product.price.toLocaleString()}
          </p>

          <Link
            to={`/product/${product.id}`}
            aria-label={`View details of ${product.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8C8B7] text-[#3B2F2F]! transition-all duration-300 hover:scale-105 hover:border-[#A67C52]"
          >
            <FiArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const Shop = () => {
  const {
    products,
    loading,
    error,
    refreshProducts,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(60000);
  const [showFilters, setShowFilters] = useState(false);

  const heroRef = useRef(null);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory &&
        product.price <= maxPrice
      );
    });

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, category, sort, maxPrice]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
    setMaxPrice(60000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-watch",
        { opacity: 0, scale: 0.85, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.6,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".featured-text",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF8F4]">

        {/* Featured Hero — Unchanged */}
        <section
          ref={heroRef}
          className="relative flex min-h-screen items-center overflow-hidden bg-[#F5F1E9] pt-24"
        >
          <span className="pointer-events-none absolute top-[25%] left-1/2 -translate-x-1/2 text-[17vw] font-bold whitespace-nowrap text-[#E5D9CA]/70 select-none">
            LUXETIME
          </span>

          <div className="relative z-10 mx-auto grid w-full max-w-350 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-12">

            <div className="relative z-20">
              <p className="featured-text mb-6 text-xs tracking-[5px] text-[#A67C52] uppercase">
                THE ART OF FINE WATCHMAKING
              </p>

              <h1
                className="featured-text text-5xl leading-[1.05] text-[#3B2F2F] md:text-7xl lg:text-[85px]"
                style={{ fontFamily: "Playfair Display" }}
              >
                Beyond
                <br />
                <span className="italic text-[#A67C52]">
                  Ordinary.
                </span>
              </h1>

              <p className="featured-text mt-8 max-w-md text-base leading-relaxed text-[#7A6A5F] md:text-lg">
                Discover extraordinary timepieces crafted with
                precision, passion, and timeless elegance.
              </p>

              <motion.a
                href="#products"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="featured-text mt-10 inline-flex items-center gap-3 rounded-full bg-[#3B2F2F] px-9 py-4 font-medium text-[#E8C9A7]!"
              >
                EXPLORE COLLECTION
                <FiArrowUpRight size={19} />
              </motion.a>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute h-80 w-80 rounded-full bg-[#E8DED1] md:h-125 md:w-125" />

              <img
                src={featuredWatch}
                alt="Featured Luxury Watch"
                className="featured-watch relative z-10 h-137.5 w-full max-w-137.5 rounded-3xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Premium Watch Gallery */}
        <section
          id="products"
          className="mx-auto max-w-350 scroll-mt-20 px-6 py-28 lg:px-12"
        >

          {/* Gallery Heading */}
          <div className="mb-20 text-center">
            <div className="mb-7 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-[#A67C52]" />

              <p className="text-[10px] font-semibold tracking-[4px] text-[#A67C52] uppercase">
                DISCOVER THE COLLECTION
              </p>

              <span className="h-px w-10 bg-[#A67C52]" />
            </div>

            <h2
              className="text-5xl leading-[1.1] text-[#3B2F2F] md:text-6xl lg:text-7xl"
              style={{ fontFamily: "Playfair Display" }}
            >
              The Watch
              <span className="italic text-[#A67C52]">
                {" "}Gallery
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-xl leading-8 text-[#7A6A5F]">
              Explore our exclusive selection of luxury timepieces,
              thoughtfully curated for every moment.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="mb-8 flex cursor-pointer items-center gap-3 rounded-full bg-[#3B2F2F] px-7 py-3.5 text-xs font-medium tracking-[2px] text-[#E8C9A7]! lg:hidden"
          >
            <FiSliders size={18} />
            FILTERS
          </button>

          <div className="flex flex-col gap-12 lg:flex-row">

            {/* Filters Sidebar */}
            <aside
              className={`shrink-0 lg:w-62.5 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              <div className="rounded-[22px] border border-[#DED2C5]/60 bg-[#F5F1E9] p-7 lg:sticky lg:top-28">

                <div className="mb-9 flex items-center justify-between border-b border-[#DED2C5] pb-6">
                  <h3
                    className="text-[27px] text-[#3B2F2F]"
                    style={{ fontFamily: "Playfair Display" }}
                  >
                    Refine Selection
                  </h3>

                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    aria-label="Close filters"
                    className="cursor-pointer text-[#3B2F2F] lg:hidden"
                  >
                    <FiX size={22} />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-10">
                  <h4 className="mb-6 text-xs font-semibold tracking-[2px] text-[#3B2F2F] uppercase">
                    Categories
                  </h4>

                  <div className="flex flex-col gap-5">
                    {categories.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        className={`flex cursor-pointer items-center justify-between text-left text-sm transition-colors duration-300 ${
                          category === item
                            ? "font-semibold text-[#A67C52]"
                            : "text-[#7A6A5F] hover:text-[#3B2F2F]"
                        }`}
                      >
                        <span>
                          {item === "All"
                            ? "All Watches"
                            : `${item} Watches`}
                        </span>

                        <span
                          className={`h-2 w-2 rounded-full ${
                            category === item
                              ? "bg-[#A67C52]"
                              : "bg-transparent"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-10 border-t border-[#DED2C5] pt-8">
                  <h4 className="mb-6 text-xs font-semibold tracking-[2px] text-[#3B2F2F] uppercase">
                    Price Range
                  </h4>

                  <input
                    type="range"
                    min="15000"
                    max="60000"
                    step="1000"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(Number(e.target.value))
                    }
                    className="w-full cursor-pointer accent-[#3B2F2F]"
                  />

                  <div className="mt-4 flex items-center justify-between text-xs text-[#7A6A5F]">
                    <span>Rs. 15,000</span>
                    <span>Rs. {maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full cursor-pointer rounded-full bg-[#3B2F2F] py-3.5 text-xs font-medium tracking-[2px] text-[#E8C9A7]! transition-transform duration-300 hover:scale-102"
                >
                  RESET FILTERS
                </button>
              </div>
            </aside>

            {/* Right Product Area */}
            <div className="min-w-0 flex-1">

              {/* Search and Sort */}
              <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[#DED2C5] pb-8 sm:flex-row">

                <div className="relative w-full sm:max-w-sm">
                  <FiSearch
                    size={19}
                    className="absolute top-1/2 left-5 -translate-y-1/2 text-[#A67C52]"
                  />

                  <input
                    type="text"
                    placeholder="Search timepieces..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-full border border-[#DED2C5]/60 bg-[#F5F1E9] py-3.5 pr-5 pl-13 text-sm text-[#3B2F2F] outline-none transition-colors focus:border-[#A67C52]"
                  />
                </div>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="cursor-pointer rounded-full border border-[#DED2C5]/60 bg-[#F5F1E9] px-6 py-3.5 text-sm text-[#3B2F2F] outline-none"
                >
                  <option value="default">
                    Sort By: Featured
                  </option>
                  <option value="low">
                    Price: Low to High
                  </option>
                  <option value="high">
                    Price: High to Low
                  </option>
                </select>
              </div>

              {/* Loading & Error */}
              {loading ? (
                <div className="py-24 text-center text-[#7A6A5F]">
                  Loading luxury watches...
                </div>
              ) : error ? (
                <div className="py-24 text-center">
                  <p className="mb-6 text-[#7A6A5F]">{error}</p>

                  <button
                    type="button"
                    onClick={refreshProducts}
                    className="rounded-full bg-[#3B2F2F] px-8 py-3.5 text-[#E8C9A7]!"
                  >
                    TRY AGAIN
                  </button>
                </div>
              ) : (
                <>
                  {/* Product Count */}
                  <div className="mb-9 flex items-center justify-between">
                    <p className="text-sm text-[#7A6A5F]">
                      Showing{" "}
                      <span className="font-semibold text-[#3B2F2F]">
                        {filteredProducts.length}
                      </span>{" "}
                      of {products.length} timepieces
                    </p>

                    <span className="hidden text-[10px] tracking-[2px] text-[#A67C52] uppercase sm:block">
                      THE LUXETIME EDIT
                    </span>
                  </div>

                  {/* Product Grid */}
                  <motion.div
                    layout
                    className="grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Empty Results */}
                  {filteredProducts.length === 0 && (
                    <div className="rounded-2xl bg-[#F5F1E9] py-20 text-center">
                      <p className="mb-6 text-[#7A6A5F]">
                        No watches found. Try changing your filters.
                      </p>

                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-3 text-sm font-medium text-[#3B2F2F]"
                      >
                        RESET FILTERS
                        <FiArrowRight size={17} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Shop;