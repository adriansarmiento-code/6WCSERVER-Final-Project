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

// Auth API calls
// Auth API calls
export const authAPI = {
  register: (userData) => apiClient.post("/auth/register", userData),
  login: (credentials) => apiClient.post("/auth/login", credentials),
  getMe: () => apiClient.get("/auth/me"),
  updateProfile: (data) => apiClient.put("/auth/me", data),

  // Base64 upload - converts image to Base64 string
  uploadProfileImage: async (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const base64String = reader.result;
          const response = await apiClient.post("/auth/upload-image", {
            image: base64String,
          });
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(imageFile);
    });
  },
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

// Message API calls
export const messageAPI = {
  getConversations: () => apiClient.get("/messages/conversations"),
  getMessages: (otherUserId) => apiClient.get(`/messages/${otherUserId}`),
  sendMessage: (otherUserId, message) =>
    apiClient.post(`/messages/${otherUserId}`, { message }),
};

// Admin API calls
export const adminAPI = {
  getStats: () => apiClient.get("/admin/stats"),
  getActivity: () => apiClient.get("/admin/activity"),
  getAllUsers: (params) => apiClient.get("/admin/users", { params }),
  getAllProviders: (params) => apiClient.get("/admin/providers", { params }),
  verifyProvider: (id) => apiClient.put(`/admin/providers/${id}/verify`),
  getAllBookings: (params) => apiClient.get("/admin/bookings", { params }),
  getAllReviews: (params) => apiClient.get("/admin/reviews", { params }),
  updateReviewStatus: (id, status) =>
    apiClient.put(`/admin/reviews/${id}/status`, { status }),
};
export default apiClient;
