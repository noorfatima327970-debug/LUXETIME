import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const demoProducts = [
  {
    id: 1,
    name: "Royal Chronograph",
    category: "Men",
    price: 28500,
    rating: 5,
    image: "/images/watch1.jpg",
    badge: "BEST SELLER",
    description:
      "A refined chronograph inspired by classic watchmaking and modern elegance.",
  },
  {
    id: 2,
    name: "Classic Elegance",
    category: "Women",
    price: 22500,
    rating: 5,
    image: "/images/watch2.jpg",
    badge: "POPULAR",
    description:
      "A graceful timepiece designed for effortless sophistication.",
  },
  {
    id: 3,
    name: "Midnight Edition",
    category: "Luxury",
    price: 45000,
    rating: 5,
    image: "/images/watch3.jpg",
    badge: "EXCLUSIVE",
    description:
      "A bold luxury watch featuring a timeless midnight-inspired design.",
  },
  {
    id: 4,
    name: "Heritage Automatic",
    category: "Men",
    price: 32500,
    rating: 5,
    image: "/images/watch4.jpg",
    badge: "",
    description:
      "A distinctive watch inspired by heritage craftsmanship.",
  },
  {
    id: 5,
    name: "Rose Gold Charm",
    category: "Women",
    price: 26500,
    rating: 5,
    image: "/images/watch5.jpg",
    badge: "NEW",
    description:
      "A delicate rose-gold-inspired watch with a contemporary finish.",
  },
  {
    id: 6,
    name: "Prestige Collection",
    category: "Luxury",
    price: 55000,
    rating: 5,
    image: "/images/watch6.jpg",
    badge: "LIMITED",
    description:
      "A statement timepiece created for a sophisticated style.",
  },
  {
    id: 7,
    name: "Urban Classic",
    category: "Men",
    price: 19500,
    rating: 5,
    image: "/images/watch7.jpg",
    badge: "TRENDING",
    description:
      "A versatile everyday watch combining simplicity and elegance.",
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    for (const product of demoProducts) {
      await Product.updateOne(
        { id: product.id },
        { $set: product },
        { upsert: true }
      );
    }

    console.log("✅ 7 LUXETIME demo products saved successfully!");
  } catch (error) {
    console.error("❌ Seed Error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();