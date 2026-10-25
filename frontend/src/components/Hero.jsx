import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { FiArrowUpRight, FiArrowDown } from "react-icons/fi";

const Hero = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen overflow-hidden flex items-end"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/watch-hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent" />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />

      <div className="relative z-10 w-full max-w-350 mx-auto px-6 md:px-12 lg:px-20 pb-24 md:pb-28 pt-36">
        <div ref={contentRef} className="max-w-3xl text-left text-white">

          <p className="text-[#E8C9A7] uppercase tracking-[5px] text-[11px] md:text-xs mb-5">
            A NEW ERA OF LUXURY
          </p>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-normal leading-[1.05] tracking-tight"
            style={{ fontFamily: "Playfair Display" }}
          >
            TIMELESS
            <br />
            <span className="italic text-[#E8C9A7]">
              BY DESIGN.
            </span>
          </h1>

          <p className="text-white/85 text-sm md:text-lg max-w-xl mt-7 leading-relaxed font-light">
            Precision in every detail. Elegance in every moment.
            Discover watches crafted to define your legacy.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-9">
            <motion.a
              href="/shop"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 bg-[#3B2F2F] text-white px-9 py-4 rounded-full font-medium shadow-lg"
            >
              EXPLORE COLLECTION
              <FiArrowUpRight size={19} />
            </motion.a>

            <motion.a
              href="#about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center bg-[#3B2F2F] text-white px-9 py-4 rounded-full font-medium shadow-lg"
            >
              OUR STORY
            </motion.a>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 right-8 md:right-16 z-10 hidden md:flex flex-col items-center gap-3 text-white/80"
      >
        <span className="text-[10px] uppercase tracking-[3px]">
          SCROLL
        </span>
        <FiArrowDown size={20} />
      </motion.div>
    </section>
  );
};

export default Hero;