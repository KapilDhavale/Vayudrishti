import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config"; // Firebase auth instance
import io from "socket.io-client"; // Import socket.io-client
import StarterPage from "./StarterPage"; // Import StarterPage component
import LandingPage from "./LandingPage"; // Import LandingPage component
import LoginPage from "./login/LoginPage";
import Navbar from "./Navbar"; // Import Navbar component
import SignupPage from "./login/SignupPage";
import ForgotPasswordPage from "./login/ForgotPasswordPage";
import DataDisplay from "./DataDisplay";
import Logout from "./login/Logout"; // Import the Logout component
import CardDisplayPage from "./CardDisplayPage"; // New page for card display logic
import SocialMedia from "./SocialMedia";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        if (!socket) {
          const socketInstance = io("http://localhost:3001");
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
      {/* Conditionally render Navbar only after authentication */}
      {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<StarterPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Private Routes (With Navbar) */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DataDisplay socket={socket} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/cards/:locationName"
          element={
            isAuthenticated ? <CardDisplayPage /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/social-media"
          element={isAuthenticated ? <SocialMedia /> : <Navigate to="/login" />}
        />

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
