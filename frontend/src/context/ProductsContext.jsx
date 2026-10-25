import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { fetchProducts } from "../api/productsApi";

const ProductsContext = createContext(null);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchProducts();

      if (!Array.isArray(data)) {
        throw new Error("Invalid products response");
      }

      setProducts(data);
    } catch (err) {
      console.error("Products API Error:", err);

      setError(
        "Unable to load watches. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts: loadProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductsProvider"
    );
  }

  return context;
};