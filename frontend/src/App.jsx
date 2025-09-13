import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import Login from './components/Login';
import LanguageSelector from './components/language-selector';
import DigiKissanNavbar from './components/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import SchemesDashboard from './components/Scheme/SchemesDashboard';
import ChatBot from './components/Chatbot/Chatbot';
import FarmerProductInterface from './components/Farmer/Farmer';
import Vendor from './components/Vendor/Vendor';
import Payment from './components/Vendor/Payment';
import BuyerSection from './components/Vendor/BuyerSection';

const ProtectedRoute = ({ isLogin, children }) => {
  return isLogin ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [language, setLanguage] = useState('en');

  // 🔑 Check token in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    }
  }, []);

  return (
    <Router>
      <LanguageSelector setLanguage={setLanguage} />
      <ToastContainer position="top-right" autoClose={3000} />
      <DigiKissanNavbar isLogin={isLogin} setIsLogin={setIsLogin} />
      <ChatBot />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />

        {/* Protected Routes */}
        <Route
          path="/scheme-detail"
          element={
            <ProtectedRoute isLogin={isLogin}>
              <SchemesDashboard language={language} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer-submission-form"
          element={
            <ProtectedRoute isLogin={isLogin}>
              <FarmerProductInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor-detail"
          element={
            <ProtectedRoute isLogin={isLogin}>
              <Vendor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute isLogin={isLogin}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer-section"
          element={
            <ProtectedRoute isLogin={isLogin}>
              <BuyerSection />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;