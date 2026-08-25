import { api } from './client';

export const authAPI = {
  // Login with phone/email and password
  login: async (identifier, password) => {
    return api.post('/auth/login', { identifier, password }).catch(async (err) => {
      // Fallback endpoint if backend uses /users/login
      return api.post('/users/login', { identifier, email: identifier, phone: identifier, password });
    });
  },

  // Register new user
  register: async (userData) => {
    return api.post('/auth/register', userData).catch(async () => {
      return api.post('/users/register', userData);
    });
  },

  // Get current logged-in user profile
  getProfile: async () => {
    return api.get('/auth/me').catch(async () => {
      return api.get('/users/profile');
    });
  },

  // Update user profile
  updateProfile: async (data) => {
    return api.put('/auth/profile', data).catch(async () => {
      return api.put('/users/profile', data);
    });
  },
};

export default authAPI;
