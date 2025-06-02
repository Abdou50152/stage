import api from '../utils/api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/user';

export const UsersService = {
  // Register new user
  register: async (userData: RegisterData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Store token in localStorage for future authenticated requests
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  // Check if user is admin
  isAdmin: () => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    try {
      const userData = JSON.parse(user);
      return userData.role === 'admin';
    } catch (error) {
      console.error('Error parsing user data:', error);
      return false;
    }
  },
  
  // Get admin panel URL
  getAdminUrl: () => {
    return 'http://localhost:3000'; // URL of the admin panel
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userData: Partial<User>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.put('/users/profile', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update stored user data
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      // Si l'utilisateur est authentifié, essayer de récupérer ses commandes
      if (token && user && user.id) {
        try {
          // Essayer d'abord avec l'endpoint spécifique aux utilisateurs
          const response = await api.get(`/users/${user.id}/orders`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return response.data;
        } catch (userOrdersError) {
          console.warn('Impossible de récupérer les commandes via /users/id/orders, essai avec /orders');
          // Si ça échoue, essayer avec l'endpoint général des commandes
          const allOrdersResponse = await api.get('/orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Filtrer les commandes pour ne garder que celles de l'utilisateur courant
          if (allOrdersResponse.data && allOrdersResponse.data.orders) {
            return allOrdersResponse.data.orders.filter(order => order.userId === user.id);
          } else if (Array.isArray(allOrdersResponse.data)) {
            return allOrdersResponse.data.filter(order => order.userId === user.id);
          }
          return [];
        }
      }
      
      // Fallback : récupérer depuis le localStorage si l'utilisateur n'est pas authentifié
      // ou si les requêtes API ont échoué
      console.log('Utilisation du fallback localStorage pour les commandes');
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      return localOrders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      // Fallback : récupérer depuis le localStorage en cas d'erreur
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      return localOrders;
    }
  }
};

export default UsersService;
