import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BestSellers from "../components/BestSellers";
import About from "../components/About";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <BestSellers />
      <About />
      <Footer />
    </>
  );
};

export default Home;