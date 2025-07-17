import axios from 'axios';

const API_URL = 'http://localhost:5001/sweets';

const sweetService = {
  // Get all sweets with optional sorting
  getAllSweets: async (sortBy) => {
    const response = await axios.get(`${API_URL}${sortBy ? `?sort=${sortBy}` : ''}`);
    return response.data;
  },

  // Search sweets by criteria
  searchSweets: async (criteria) => {
    const params = new URLSearchParams();
    if (criteria.name) params.append('name', criteria.name);
    if (criteria.category) params.append('category', criteria.category);
    if (criteria.minPrice) params.append('minPrice', criteria.minPrice);
    if (criteria.maxPrice) params.append('maxPrice', criteria.maxPrice);
    
    const response = await axios.get(`${API_URL}/search?${params.toString()}`);
    return response.data;
  },

  // Add new sweet
  addSweet: async (sweetData) => {
    const response = await axios.post(API_URL, sweetData);
    return response.data;
  },

  // Delete sweet
  deleteSweet: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Purchase sweet
  purchaseSweet: async (id, quantity) => {
    const response = await axios.post(`${API_URL}/${id}/purchase`, { quantity });
    return response.data;
  },

  // Restock sweet
  restockSweet: async (id, quantity) => {
    const response = await axios.post(`${API_URL}/${id}/restock`, { quantity });
    return response.data;
  },
  
  // Update sweet
  updateSweet: async (id, sweetData) => {
    const response = await axios.put(`${API_URL}/${id}`, sweetData);
    return response.data;
  }
};

export default sweetService;