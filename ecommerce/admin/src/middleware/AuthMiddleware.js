import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminService } from '../services/admin.service';

// Auth middleware component to protect admin routes
const AuthMiddleware = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated and is admin
        const isAuth = AdminService.isAuthenticated();
        setIsAuthenticated(isAuth);

        if (isAuth) {
          // Verify token validity by fetching profile
          await AdminService.getProfile();
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
        // Clear invalid authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    // Show loading indicator while checking authentication
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default AuthMiddleware;
