import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  FiHeart,
  FiShoppingBag,
  FiArrowUpRight,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";

import { FaStar } from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductsContext";

gsap.registerPlugin(ScrollTrigger);

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
    <div className="luxury-product-card group relative">
      {/* Product Image */}
      <div className="relative h-100 overflow-hidden rounded-[22px] border border-[#D8C8B7]/40 bg-[#F0EAE2] md:h-112.5">

        {/* Product Number */}
        <span className="absolute bottom-6 left-6 z-10 text-xs tracking-[3px] text-[#3B2F2F]/45">
          0{index + 1}
        </span>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-5 left-5 z-20 rounded-full border border-[#D7BFA5]/30 bg-[#3B2F2F] px-4 py-2 text-[9px] font-medium tracking-[2px] text-[#E8C9A7]">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={`Toggle wishlist for ${product.name}`}
          className="absolute top-5 right-5 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#D8C8B7]/50 bg-[#FFFCF8]/95 text-[#3B2F2F] shadow-sm transition-all duration-300 hover:scale-105"
        >
          <FiHeart
            size={19}
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
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full w-full object-cover"
          />
        </Link>

        {/* Add to Cart */}
        <div className="absolute right-5 bottom-5 left-5 z-20 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#3B2F2F] px-6 py-4 text-xs font-medium tracking-[2px] text-[#E8C9A7]! shadow-[0_12px_30px_rgba(59,47,47,0.15)] transition-transform duration-300 hover:scale-102"
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
      <div className="px-1 pt-7">

        <p className="mb-3 text-[10px] font-medium tracking-[3px] text-[#A67C52] uppercase">
          {product.category} Collection
        </p>

        <Link to={`/product/${product.id}`}>
          <h3
            className="mb-4 text-[27px] leading-snug text-[#3B2F2F] transition-colors duration-300 hover:text-[#A67C52]"
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

        <div className="flex items-center justify-between border-t border-[#DED2C5]/70 pt-5">
          <p className="text-xl font-semibold tracking-wide text-[#3B2F2F]">
            Rs. {product.price.toLocaleString()}
          </p>

          <Link
            to={`/product/${product.id}`}
            aria-label={`View details of ${product.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8C8B7] text-[#3B2F2F]! transition-all duration-300 hover:border-[#A67C52] hover:scale-105"
          >
            <FiArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const BestSellers = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  const {
    products,
    loading,
    error,
    refreshProducts,
  } = useProducts();

  const bestSellerProducts = products.filter((product) =>
    [1, 2, 3].includes(product.id)
  );

  useEffect(() => {
    if (loading || bestSellerProducts.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".luxury-product-card",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".luxury-product-card",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, bestSellerProducts.length]);

  return (
    <section
      id="shop"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FFFCF8] py-28 md:py-36"
    >
      {/* Decorative Detail */}
      <div className="pointer-events-none absolute top-20 right-0 h-px w-40 bg-[#D8C8B7]/60 md:w-80" />

      <div className="relative mx-auto max-w-350 px-6 lg:px-12">

        {/* Section Heading */}
        <div
          ref={headingRef}
          className="mb-16 flex flex-col gap-9 md:mb-20 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#A67C52]" />

              <p className="text-[10px] font-semibold tracking-[4px] text-[#A67C52] uppercase">
                THE LUXETIME SELECTION
              </p>
            </div>

            <h2
              className="text-5xl leading-[1.1] text-[#3B2F2F] md:text-6xl lg:text-7xl"
              style={{ fontFamily: "Playfair Display" }}
            >
              Our Best
              <span className="italic text-[#A67C52]">
                {" "}Sellers
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#7A6A5F]">
              Discover our three most loved timepieces,
              where timeless elegance meets exceptional craftsmanship.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex w-fit items-center gap-3 border-b border-[#A67C52] pb-3 text-xs font-semibold tracking-[2px] text-[#3B2F2F]! transition-all duration-300 hover:gap-4"
          >
            VIEW ALL WATCHES
            <FiArrowUpRight size={19} />
          </Link>
        </div>

        {/* Products */}
        {loading ? (
          <div className="py-20 text-center text-[#7A6A5F]">
            Loading luxury watches...
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="mb-5 text-[#7A6A5F]">
              {error}
            </p>

            <button
              type="button"
              onClick={refreshProducts}
              className="rounded-full bg-[#3B2F2F] px-8 py-3 text-[#E8C9A7]!"
            >
              TRY AGAIN
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-9 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {bestSellerProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 flex flex-col items-center gap-6">

          <span className="h-px w-16 bg-[#C5AD95]" />

          <motion.div
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-4 rounded-full bg-[#3B2F2F] px-12 py-4 text-xs font-medium tracking-[2px] text-[#E8C9A7]! shadow-[0_15px_35px_rgba(59,47,47,0.12)]"
            >
              EXPLORE ALL WATCHES
              <FiArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;