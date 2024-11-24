// src/Logout.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // To redirect after logout
import { getAuth, signOut } from "firebase/auth"; // Firebase Auth

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    // Sign out the user
    signOut(auth)
      .then(() => {
        // Redirect to login page after successful logout
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }, [navigate]);

  return <div>Logging you out...</div>;
};

export default Logout;
