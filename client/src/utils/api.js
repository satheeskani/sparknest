import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("sparknest_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Products
export const fetchProducts = (params) => API.get("/products", { params });
export const fetchProduct = (id) => API.get(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/review`, data);

// AI
export const aiSearch = (query) => API.post("/ai/search", { query });
export const aiRecommend = (data) => API.post("/ai/recommend", data);
export const aiChat = (messages) => API.post("/ai/chat", { messages });

export default API;