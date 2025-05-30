// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Articles from "./pages/Articles";
import Orders from "./pages/Orders";
import Admin from "./pages/admin";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Colors from "./pages/Colors";
import Sizes from "./pages/Sizes";
import Users from "./pages/Users";
import Admins from "./pages/Admins";
import Login from "./pages/Login";
import { NotificationProvider } from "./context/NotificationContext";
import AuthMiddleware from "./middleware/AuthMiddleware";
import { AdminService } from "./services/admin.service";

function App() {
  useEffect(() => {
    // Create default admin account when the app loads
    // This is just to ensure the admin account exists for demo purposes
    // In a real application, this would be handled during backend setup
    const checkAdminExists = async () => {
      try {
        // Check if admin is already logged in
        if (AdminService.isAuthenticated()) {
          console.log('Admin already authenticated');
        }
      } catch (error) {
        console.error('Error checking admin authentication:', error);
      }
    };

    checkAdminExists();
  }, []);

  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes that require admin authentication */}
          <Route path="/" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Dashboard />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          <Route path="/dashboard" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Dashboard />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          {/* Other protected routes */}
          <Route path="/articles" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Articles />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          <Route path="/products" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Products />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          <Route path="/categories" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Categories />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          <Route path="/colors" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Colors />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          <Route path="/sizes" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Sizes />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          <Route path="/orders" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Orders />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          <Route path="/users" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Users />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          <Route path="/admins" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Admins />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          <Route path="/admin" element={
            <AuthMiddleware>
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex flex-1">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6 flex-1">
                    <Admin />
                  </div>
                </div>
              </div>
            </AuthMiddleware>
          } />

          {/* Redirect all other routes to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
