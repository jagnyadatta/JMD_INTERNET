// src/utils/adminApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Auth
  login: (credentials) => api.post('/admin/login', credentials),
  getProfile: () => api.get('/admin/profile'),
  changePassword: (data) => api.put('/admin/change-password', data),

  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  // Services
  getServices: () => api.get('/services'),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),
  updateServiceStatus: (id, isActive) => 
    api.put(`/services/${id}`, { isActive }),

  // Contacts
  getContacts: (params = {}) => api.get('/contact', { params }),
  updateContactStatus: (id, data) => api.put(`/contact/${id}/status`, data),
  getContactStats: () => api.get('/contact/stats'),

  // Uploads
  getUploads: (params = {}) => api.get('/upload', { params }),
  getUploadStats: () => api.get('/upload/stats'),
  updateUploadStatus: (id, data) => api.put(`/upload/${id}/status`, data),

  // Notifications
  getAllNotifications: () => api.get('/notifications'),
  getActiveNotifications: () => api.get('/notifications/active'),
  createNotification: (data) => api.post('/notifications', data),
  updateNotification: (id, data) => api.put(`/notifications/${id}`, data),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),

  // Offers
  getOffers: () => api.get('/offers/active'),
  createOffer: (data) => api.post('/offers', data),
  updateOffer: (id, data) => api.put(`/offers/${id}`, data),
  deleteOffer: (id) => api.delete(`/offers/${id}`),
  getOfferAnalytics: () => api.get('/offers/analytics'),
};

export default api;
