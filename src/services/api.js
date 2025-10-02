import axios from "axios";
import store from "@/store";

// Base API URL
const API_URL = "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => apiClient.post("/auth/register", userData),
  login: (credentials) => apiClient.post("/auth/login", credentials),
  getMe: () => apiClient.get("/auth/me"),
  updateProfile: (data) => apiClient.put("/auth/me", data),
};

// Provider API calls
export const providerAPI = {
  getAll: (params) => apiClient.get("/providers", { params }),
  getById: (id) => apiClient.get(`/providers/${id}`),
  update: (id, data) => apiClient.put(`/providers/${id}`, data),
};

// Booking API calls
export const bookingAPI = {
  create: (data) => apiClient.post("/bookings", data),
  getAll: (params) => apiClient.get("/bookings", { params }),
  getById: (id) => apiClient.get(`/bookings/${id}`),
  update: (id, data) => apiClient.put(`/bookings/${id}`, data),
  cancel: (id) => apiClient.delete(`/bookings/${id}`),
};

// Review API calls
export const reviewAPI = {
  create: (data) => apiClient.post("/reviews", data),
  getProviderReviews: (providerId) =>
    apiClient.get(`/reviews/provider/${providerId}`),
  addResponse: (id, response) =>
    apiClient.put(`/reviews/${id}/response`, response),
  getAll: (params) => apiClient.get("/reviews", { params }),
  updateStatus: (id, status) => apiClient.put(`/reviews/${id}/status`, status),
};

apiClient.interceptors.request.use(
  (config) => {
    const token = store.getters.getToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
