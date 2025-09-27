import axios from 'axios';

// Use environment variable with fallback for flexibility
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const apiService = {
  // Health check endpoint
  async healthCheck() {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Create single request
  async createRequest(requestData) {
    const response = await apiClient.post('/requests', requestData);
    return response.data;
  },
  
  // Create multiple requests (for offline sync)
  async createRequestsBulk(requests) {
    const response = await apiClient.post('/requests/bulk', { requests });
    return response.data;
  },
  
  // Get all requests
  async getRequests() {
    const response = await apiClient.get('/requests');
    return response.data;
  },
  
  // Update request status
  async updateRequest(id, updates) {
    const response = await apiClient.patch(`/requests/${id}`, updates);
    return response.data;
  },

  // Optional: Delete request (if you add this to backend)
  async deleteRequest(id) {
    const response = await apiClient.delete(`/requests/${id}`);
    return response.data;
  }
};

export default apiService;