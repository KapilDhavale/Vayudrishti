import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config"; // Firebase auth instance
import io from "socket.io-client"; // Import socket.io-client

import StarterPage from "./StarterPage"; // Landing Starter Page
import LandingPage from "./LandingPage"; // Landing Page
import LoginPage from "./login/LoginPage"; // Login Page
import SignupPage from "./login/SignupPage"; // Signup Page
import ForgotPasswordPage from "./login/ForgotPasswordPage"; // Forgot Password
import DataDisplay from "./DataDisplay"; // Dashboard / Data Display Page
import SocialMedia from "./SocialMedia"; // Social Media Analytics
import CardDisplayPage from "./CardDisplayPage"; // Card Display Page
import Logout from "./login/Logout"; // Logout Page
import Map from "./Maps"; // Map Page
import RealTimeData from "./RealTimeData"; // Real-Time Data Page
import Analytics from "./Analytics"; // Tableau Analytics Page
import Navbar from "./Navbar"; // Navbar Component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        if (!socket) {
          const socketInstance = io("https://vayudrishti-backend.onrender.com"); // Adjust backend URL if needed
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
      {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<StarterPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DataDisplay socket={socket} /> : <Navigate to="/login" />}
        />
        <Route
          path="/cards/:locationName"
          element={isAuthenticated ? <CardDisplayPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/social-media"
          element={isAuthenticated ? <SocialMedia /> : <Navigate to="/login" />}
        />
        <Route
          path="/maps"
          element={isAuthenticated ? <Map /> : <Navigate to="/login" />}
        />
        <Route
          path="/realtime"
          element={isAuthenticated ? <RealTimeData /> : <Navigate to="/login" />}
        />
        <Route
          path="/analytics"
          element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />}
        />

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
