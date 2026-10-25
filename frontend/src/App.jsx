import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

import ScrollToTop from "./components/ScrollToTop";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProductsProvider } from "./context/ProductsContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <ProductsProvider>
        <CartProvider>
          <WishlistProvider>
            <AuthProvider>
              <ScrollToTop />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />

                <Route
                  path="/product/:id"
                  element={<ProductDetails />}
                />

                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />

                <Route
                  path="/login"
                  element={<Auth mode="login" />}
                />

                <Route
                  path="/signup"
                  element={<Auth mode="signup" />}
                />

                <Route
                  path="/checkout"
                  element={<Checkout />}
                />

                <Route
                  path="/my-orders"
                  element={<MyOrders />}
                />
              </Routes>
            </AuthProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
}

export default App;