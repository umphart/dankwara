const API_BASE_URL = 'http://localhost:5000/api';

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
  // Get all phones
  getAllPhones: () => apiRequest('/phones'),
  
  // Get available phones
  getAvailablePhones: () => apiRequest('/phones/available'),
  
  // Get phone statistics
  getPhoneStats: () => apiRequest('/phones/stats'),
  
  // Get phone by ID
  getPhoneById: (id) => apiRequest(`/phones/${id}`),
  
  // Create new phone
  createPhone: (phoneData) => 
    apiRequest('/phones', {
      method: 'POST',
      body: phoneData,
    }),
  
  // Delete phone
  deletePhone: (id) => 
    apiRequest(`/phones/${id}`, {
      method: 'DELETE',
    }),
};

// Sales API functions
export const salesAPI = {
  // Get all sales
  getAllSales: () => apiRequest('/sales'),
  
  // Get sales statistics
  getSalesStats: () => apiRequest('/sales/stats'),
  
  // Get recent sales
  getRecentSales: (limit = 5) => apiRequest(`/sales/recent?limit=${limit}`),
  
  // Get sale by ID
  getSaleById: (id) => apiRequest(`/sales/${id}`),
  
  // Create new sale
  createSale: (saleData) => 
    apiRequest('/sales', {
      method: 'POST',
      body: saleData,
    }),
};