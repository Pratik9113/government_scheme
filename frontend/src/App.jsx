import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Login from './components/Login';
import EventList from './components/Event/EventList';
import CreateEventForm from './components/Event/CreateEventForm';
import FarmerSubmissionForm from './components/Farmer/Farmer';

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isGuestLogin, setIsGuestLogin] = useState(false);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      {!isLogin && !isGuestLogin && <Login setIsLogin={setIsLogin} setIsGuestLogin={setIsGuestLogin} />}
      <Routes>
        <Route
          path='/'
          element={isGuestLogin || isLogin ? <EventList isGuestLogin={isGuestLogin} /> : <Login setIsLogin={setIsLogin} setIsGuestLogin={setIsGuestLogin} />}
        />
        {/* <Route
          path='/create'
          element={<ProtectedCreateEventForm isLogin={isLogin} />}
        /> */}
        <Route
          path='/create'
          element={<FarmerSubmissionForm isLogin={isLogin} />}
        />
      </Routes>
    </Router>
  );
};

const ProtectedCreateEventForm = ({ isLogin }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLogin) {
      toast.error("You must be logged in to create an event!");
      navigate("/");
    }
  }, []);

  // return isLogin ? <CreateEventForm /> : null; // Only render CreateEventForm if logged in or guest login
  return isLogin ? <FarmerSubmissionForm /> : null;
}

export default App;
