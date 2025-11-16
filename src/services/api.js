// Use production backend URL
const API_BASE_URL = 'https://dankwara-backend.onrender.com/api';

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  if (config.body) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Phone API functions
export const phoneAPI = {
  getAllPhones: () => apiRequest('/phones'),
  getAvailablePhones: () => apiRequest('/phones/available'),
  getPhoneStats: () => apiRequest('/phones/stats'),
  getPhoneById: (id) => apiRequest(`/phones/${id}`),
  createPhone: (phoneData) => 
    apiRequest('/phones', {
      method: 'POST',
      body: phoneData,
    }),
  deletePhone: (id) => 
    apiRequest(`/phones/${id}`, {
      method: 'DELETE',
    }),
};

// Sales API functions
export const salesAPI = {
  getAllSales: () => apiRequest('/sales'),
  getSalesStats: () => apiRequest('/sales/stats'),
  getRecentSales: (limit = 5) => apiRequest(`/sales/recent?limit=${limit}`),
  getSaleById: (id) => apiRequest(`/sales/${id}`),
  createSale: (saleData) => 
    apiRequest('/sales', {
      method: 'POST',
      body: saleData,
    }),
};