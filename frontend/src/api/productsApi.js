const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const fetchJSON = async (endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products. Status: ${response.status}`
    );
  }

  return response.json();
};

export const fetchProducts = async () => {
  const data = await fetchJSON("/api/products");

  return data.products;
};

export const fetchProductById = async (id) => {
  const data = await fetchJSON(`/api/products/${id}`);

  return data.product;
};

export default API_URL;