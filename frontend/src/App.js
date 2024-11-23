import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import io from 'socket.io-client';
import StarterPage from './StarterPage';
import LandingPage from './LandingPage'; // Import LandingPage
import LoginPage from './login/LoginPage';
import SignupPage from './login/SignupPage';
import ForgotPasswordPage from './login/ForgotPasswordPage';
import DataDisplay from './DataDisplay';
import Logout from './login/Logout';
import CardDisplayPage from './CardDisplayPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        if (!socket) {
          const socketInstance = io('http://localhost:3001');
          setSocket(socketInstance);
        }
      } else {
        setIsAuthenticated(false);
        if (socket) {
          socket.disconnect();
          setSocket(null);
        }
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
      unsubscribe();
    };
  }, [socket]);

  return (
    <Router>
      <Routes>
        {/* Starter Page Route */}
        <Route path="/" element={<StarterPage />} />

        {/* Landing Page Route */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Routes for login, signup, forgot password */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected route for the dashboard */}
        <Route path="/dashboard" element={isAuthenticated ? <DataDisplay socket={socket} /> : <Navigate to="/login" />} />

        {/* Route for the new card display page */}
        <Route path="/cards" element={isAuthenticated ? <CardDisplayPage socket={socket} /> : <Navigate to="/login" />} />

        {/* Logout route */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
