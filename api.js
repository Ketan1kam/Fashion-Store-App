import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('noir_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('noir_token');
      localStorage.removeItem('noir_user');
    }
    return Promise.reject(err);
  }
);

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const addReview = (id, data) => api.post(`/products/${id}/reviews`, data);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart', data);
export const updateCartItem = (itemId, data) => api.put(`/cart/${itemId}`, data);
export const removeFromCart = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCart = () => api.delete('/cart');

// Orders
export const createOrder = (data) => api.post('/orders', data);
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getAllOrders = (params) => api.get('/orders/admin/all', { params });
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data);

// Wishlist
export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (id) => api.post(`/wishlist/${id}`);
export const removeFromWishlist = (id) => api.delete(`/wishlist/${id}`);

export default api;
