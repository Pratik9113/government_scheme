import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Login from './components/Login';
import LanguageSelector from './components/language-selector';
import DigiKissanNavbar from './components/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import SchemesDashboard from './components/Scheme/SchemesDashboard';
import ChatBot from './components/Chatbot/Chatbot';

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [language, setLanguage] = useState('en');

  return (
    <Router>
      <LanguageSelector setLanguage={setLanguage} />
      <ToastContainer position="top-right" autoClose={3000} />
      <DigiKissanNavbar setIsLogin={setIsLogin} />
      <Routes>
        <Route path='/' element={isLogin ? <Navigate to="/user" /> : <Login setIsLogin={setIsLogin} />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/user' element={isLogin ? <SchemesDashboard language={language} /> : <Navigate to="/login" />} />
        {/* <Route path='/farmer' element={isLogin ? <FarmerProductInterface /> : ""} /> */}
      </Routes>
      <ChatBot/>
    </Router>
  );
};

export default App;
