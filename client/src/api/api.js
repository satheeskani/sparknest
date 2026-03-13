const BASE = import.meta.env.VITE_API_URL;

export const getProducts = (params = "") =>
  fetch(`${BASE}/api/products${params}`).then(r => r.json());

export const getProductBySlug = (slug) =>
  fetch(`${BASE}/api/products/${slug}`).then(r => r.json());

export const createOrder = (data) =>
  fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());