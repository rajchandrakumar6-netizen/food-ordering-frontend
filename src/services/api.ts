import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('Request headers:', config.headers);
  return config;
});

// Auth
export const register = (data: any) => api.post('/auth/register', data);
export const login = (data: any) => api.post('/auth/login', data);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (name: string) => api.post(`/categories?name=${name}`);
export const updateCategory = (id: number, name: string) => api.put(`/categories/${id}?name=${name}`);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);

// Food Items
export const getFoodItems = () => api.get('/foods');
export const getFoodItemsByCategory = (categoryId: number) => api.get(`/foods/category/${categoryId}`);
export const createFoodItem = (data: any) => api.post('/foods', data);
export const updateFoodItem = (id: number, data: any) => api.put(`/foods/${id}`, data);
export const deleteFoodItem = (id: number) => api.delete(`/foods/${id}`);
export const updateFoodStatus = (id: number, status: string) => api.put(`/foods/${id}/status?status=${status}`);

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (data: any) => api.post('/cart/add', data);
export const updateCartItem = (cartItemId: number, quantity: number) => api.put(`/cart/update/${cartItemId}?quantity=${quantity}`);
export const removeFromCart = (cartItemId: number) => api.delete(`/cart/remove/${cartItemId}`);

// Orders
export const placeOrder = (data: any) => api.post('/orders', data);
export const getUserOrders = () => api.get('/orders');
export const getAllOrders = () => api.get('/orders/all');
export const updateOrderStatus = (id: number, status: string) => api.put(`/orders/${id}/status?status=${status}`);

// Payments
export const processPayment = (data: any) => api.post('/payments', data);
export const getPaymentByOrder = (orderId: number) => api.get(`/payments/order/${orderId}`);

export default api;