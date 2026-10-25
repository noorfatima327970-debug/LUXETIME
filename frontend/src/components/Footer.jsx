import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaArrowUp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#3B2F2F] text-[#F5F1E9]"
    >
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-100 w-100 rounded-full border border-[#E8C9A7]/10" />
      <div className="pointer-events-none absolute -bottom-56 -left-40 h-125 w-125 rounded-full border border-[#E8C9A7]/10" />

      <div className="relative mx-auto max-w-350 px-6 pt-20 pb-8 md:px-12 lg:px-16">
        {/* Top Content */}
        <div className="grid gap-14 border-b border-[#E8C9A7]/20 pb-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <Link
              to="/"
              className="font-['Playfair_Display'] text-4xl font-semibold tracking-[0.12em] text-[#F5F1E9]"
            >
              LUXETIME
            </Link>

            <p className="mt-6 max-w-md text-sm leading-8 text-[#F5F1E9]/65">
              Time is more than a moment. It is a reflection of your style,
              your journey, and your legacy. Discover exceptional timepieces
              crafted for those who appreciate timeless elegance.
            </p>

            <div className="mt-8 flex items-center gap-4">
              {[
                { icon: FaInstagram, link: "https://instagram.com", label: "Instagram" },
                { icon: FaFacebookF, link: "https://facebook.com", label: "Facebook" },
                { icon: FaPinterestP, link: "https://pinterest.com", label: "Pinterest" },
              ].map(({ icon: Icon, link, label }) => (
                <a
                  key={label}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8C9A7]/30 text-[#E8C9A7] transition-all duration-300 hover:scale-105 hover:border-[#E8C9A7]"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h3 className="mb-7 text-sm font-semibold tracking-[0.2em] text-[#E8C9A7] uppercase">
              Explore
            </h3>

            <div className="flex flex-col items-start gap-4 text-sm text-[#F5F1E9]/70">
              <Link to="/" className="transition-colors hover:text-[#E8C9A7]">
                Home
              </Link>
              <Link to="/shop" className="transition-colors hover:text-[#E8C9A7]">
                Shop Watches
              </Link>
              <Link to="/#about" className="transition-colors hover:text-[#E8C9A7]">
                Our Story
              </Link>
              <Link to="/#contact" className="transition-colors hover:text-[#E8C9A7]">
                Contact
              </Link>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="mb-7 text-sm font-semibold tracking-[0.2em] text-[#E8C9A7] uppercase">
              Get in Touch
            </h3>

            <div className="space-y-5 text-sm text-[#F5F1E9]/70">
              <a
                href="mailto:support@luxetime.com"
                className="flex items-start gap-3 transition-colors hover:text-[#E8C9A7]"
              >
                <FaEnvelope className="mt-1 shrink-0 text-[#E8C9A7]" />
                support@luxetime.com
              </a>

              <a
                href="tel:+923001234567"
                className="flex items-start gap-3 transition-colors hover:text-[#E8C9A7]"
              >
                <FaPhoneAlt className="mt-1 shrink-0 text-[#E8C9A7]" />
                +92 300 1234567
              </a>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-[#E8C9A7]" />
                Pakistan
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 pt-8 text-center md:flex-row md:text-left">
          <p className="text-xs tracking-wide text-[#F5F1E9]/50">
            © {new Date().getFullYear()} LUXETIME. All rights reserved.
          </p>

          <p className="text-xs tracking-[0.12em] text-[#E8C9A7]/70">
            CRAFTED FOR TIMELESS MOMENTS
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#E8C9A7]/40 text-[#E8C9A7] transition-transform duration-300 hover:scale-105"
          >
            <FaArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;