import api from './api';

export const AdminService = {
  // Login admin
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw error;
    }
  },

  // Get all admins
  getAllAdmins: async (skip = 0, limit = 10) => {
    try {
      const response = await api.get(`/admin?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  // Get admin by ID
  getAdminById: async (id) => {
    try {
      const response = await api.get(`/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching admin with id ${id}:`, error);
      throw error;
    }
  },

  // Create new admin
  createAdmin: async (adminData) => {
    try {
      const response = await api.post('/admin', adminData);
      return response.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  // Update admin
  updateAdmin: async (id, adminData) => {
    try {
      const response = await api.put(`/admin/${id}`, adminData);
      return response.data;
    } catch (error) {
      console.error(`Error updating admin with id ${id}:`, error);
      throw error;
    }
  },

  // Delete admin
  deleteAdmin: async (id) => {
    try {
      const response = await api.delete(`/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting admin with id ${id}:`, error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/admin/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
};

export default AdminService;
