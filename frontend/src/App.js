import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';  // Firebase auth instance
import io from 'socket.io-client';  // Import socket.io-client
import LoginPage from './login/LoginPage';
import SignupPage from './login/SignupPage';
import ForgotPasswordPage from './login/ForgotPasswordPage';
import DataDisplay from './DataDisplay';
import Logout from './login/Logout'; // Import the Logout component
import CardDisplayPage from './CardDisplayPage'; // New page for card display logic

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Initialize socket connection when user is authenticated
        if (!socket) {
          const socketInstance = io('http://localhost:3001');
          setSocket(socketInstance);
        }
      } else {
        setIsAuthenticated(false);
        // Disconnect socket when user logs out
        if (socket) {
          socket.disconnect();
          setSocket(null);
        }
      }
    });

    // Cleanup the socket connection when component unmounts
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
        
        {/* Default route */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
