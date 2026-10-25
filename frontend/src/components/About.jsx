import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUpRight } from "react-icons/fi";

import aboutWatch from "../assets/about-watch.jpg";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image Reveal Animation
      gsap.fromTo(
        imageRef.current,
        {
          opacity: 0,
          x: -60,
          scale: 0.96,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Content Stagger Animation
      gsap.fromTo(
        contentRef.current.children,
        {
          opacity: 0,
          y: 45,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#EAE3D9] py-24 md:py-32 overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-112.5 h-112.5 bg-[#D6C4B1]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-350 mx-auto px-6 lg:px-12 relative z-10">

        {/* Section Label */}
        <div className="flex items-center gap-4 mb-14">

          <span className="w-12 h-px bg-[#A67C52]" />

          <p className="text-[#A67C52] uppercase tracking-[5px] text-xs font-medium">
            THE LUXETIME STORY
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">

          {/* Left Image */}
          <div ref={imageRef} className="relative">

            {/* Decorative Frame */}
            <div className="absolute -top-5 -left-5 w-full h-full border border-[#A67C52]/40 rounded-3xl hidden md:block" />

            {/* Image Container */}
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative overflow-hidden rounded-3xl shadow-2xl"
            >
              <img
                src={aboutWatch}
                alt="Luxury Watch Craftsmanship"
                className="w-full h-112.5 md:h-150 object-cover"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -bottom-7 right-5 md:-right-7 bg-[#3B2F2F] px-8 py-6 rounded-2xl shadow-xl"
            >
              <p
                className="text-[#E8C9A7] text-2xl md:text-3xl"
                style={{ fontFamily: "Playfair Display" }}
              >
                Timeless
              </p>

              <p className="text-white/80 text-xs uppercase tracking-[3px] mt-2">
                Elegance & Style
              </p>
            </motion.div>
          </div>

          {/* Right Content */}
          <div
            ref={contentRef}
            className="lg:pl-4 mt-10 lg:mt-0"
          >

            {/* Small Heading */}
            <p className="text-[#A67C52] text-xs uppercase tracking-[4px] mb-6">
              MORE THAN JUST A WATCH
            </p>

            {/* Main Heading */}
            <h2
              className="text-[#3B2F2F] text-4xl md:text-5xl lg:text-6xl leading-[1.15]"
              style={{ fontFamily: "Playfair Display" }}
            >
              Every Second
              <br />

              <span className="italic text-[#A67C52]">
                Tells a Story.
              </span>
            </h2>

            {/* Description */}
            <p className="text-[#7A6A5F] leading-relaxed mt-8 text-base md:text-lg">
              At LUXETIME, we believe that a watch is more than
              just an accessory. It is a reflection of your
              personality, your journey, and the moments that
              define who you are.
            </p>

            <p className="text-[#7A6A5F] leading-relaxed mt-5">
              Our carefully curated collection brings together
              timeless design, refined elegance, and exceptional
              attention to detail — helping you find the perfect
              timepiece for every occasion.
            </p>

            {/* Divider */}
            <div className="w-20 h-0.5 bg-[#A67C52] my-9" />

            {/* Button */}
            <motion.a
              href="/shop"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-3 bg-[#3B2F2F] text-[#E8C9A7]! hover:text-[#E8C9A7]! px-9 py-4 rounded-full font-medium shadow-md"
            >
              EXPLORE OUR COLLECTION
              <FiArrowUpRight size={19} />
            </motion.a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;