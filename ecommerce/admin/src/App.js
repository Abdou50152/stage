// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/colors" element={<Colors />} />
            <Route path="/sizes" element={<Sizes />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
            <Route path="/admins" element={<Admins />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
