import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiHeart,
  FiShoppingBag,
  FiTrash2,
  FiArrowRight,
  FiCheck,
  FiArrowUpRight,
} from "react-icons/fi";

import Navbar from "../components/Navbar";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";

const WishlistCard = ({ product }) => {
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

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
      transition={{ duration: 0.4 }}
      className="group"
    >
      <div className="relative h-100 overflow-hidden rounded-[22px] border border-[#D8C8B7]/40 bg-[#F0EAE2]">

        <Link
          to={`/product/${product.id}`}
          className="block h-full w-full"
        >
          <motion.img
            src={product.image}
            alt={product.name}
            whileHover={{ scale: 1.035 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full object-cover"
          />
        </Link>

        <button
          type="button"
          onClick={() => removeFromWishlist(product.id)}
          aria-label={`Remove ${product.name}`}
          className="absolute top-5 right-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#FFFCF8] text-[#3B2F2F] shadow-md"
        >
          <FiTrash2 size={19} />
        </button>
      </div>

      <div className="pt-7">
        <p className="mb-3 text-[10px] tracking-[3px] text-[#A67C52] uppercase">
          {product.category} Collection
        </p>

        <Link to={`/product/${product.id}`}>
          <h3
            className="mb-4 text-[27px] text-[#3B2F2F]"
            style={{ fontFamily: "Playfair Display" }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mb-7 flex items-center justify-between border-t border-[#DED2C5] pt-5">
          <p className="text-xl font-semibold text-[#3B2F2F]">
            Rs. {product.price.toLocaleString()}
          </p>

          <Link
            to={`/product/${product.id}`}
            aria-label={`View ${product.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8C8B7] text-[#3B2F2F]!"
          >
            <FiArrowUpRight size={19} />
          </Link>
        </div>

        <motion.button
          type="button"
          onClick={handleAddToCart}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#3B2F2F] px-7 py-4 text-xs font-semibold tracking-[2px] text-[#E8C9A7]!"
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
      </div>
    </motion.div>
  );
};

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();

  const {
    products,
    loading,
    error,
    refreshProducts,
  } = useProducts();

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
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
                YOUR FAVORITES
              </p>
            </div>

            <h1
              className="text-5xl text-[#3B2F2F] md:text-7xl"
              style={{ fontFamily: "Playfair Display" }}
            >
              My{" "}
              <span className="italic text-[#A67C52]">
                Wishlist
              </span>
            </h1>

            <p className="mt-6 text-[#7A6A5F]">
              {wishlist.length} saved{" "}
              {wishlist.length === 1 ? "watch" : "watches"}
            </p>
          </motion.div>

          {loading ? (
            <p className="py-20 text-center text-[#7A6A5F]">
              Loading saved watches...
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
          ) : wishlistProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center rounded-[28px] border border-[#DED2C5]/60 bg-[#F5F1E9] px-6 py-24 text-center"
            >
              <div className="mb-9 flex h-24 w-24 items-center justify-center rounded-full bg-[#EAE3D9]">
                <FiHeart size={38} className="text-[#3B2F2F]" />
              </div>

              <h2
                className="mb-5 text-3xl text-[#3B2F2F]"
                style={{ fontFamily: "Playfair Display" }}
              >
                Your Wishlist Is Empty
              </h2>

              <p className="mb-10 max-w-md leading-8 text-[#7A6A5F]">
                Save your favorite timepieces and create your personal collection.
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
            <>
              <div className="mb-10 flex justify-end">
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="cursor-pointer text-xs tracking-[1px] text-[#A67C52] uppercase"
                >
                  Clear Wishlist
                </button>
              </div>

              <motion.div
                layout
                className="grid grid-cols-1 gap-x-9 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {wishlistProducts.map((product) => (
                    <WishlistCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Wishlist;