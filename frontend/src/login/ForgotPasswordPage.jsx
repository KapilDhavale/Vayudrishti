// src/login/ForgotPasswordPage.js
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase-config";
import "./ForgotPassword.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!");
        window.location.href = "/login"; // Redirect to login page
      })
      .catch((error) => {
        alert("Error: " + error.message); // Display error message
      });
  };

  return (
    <div className="forgotpassword">
       <div className="overlay"></div>
      <div id="forgot"> Forgot Password</div>
      <form id="forgot-password-form" onSubmit={handleResetPassword}>
        <div className="forgot-input-container">
          <label htmlFor="email">Email ID:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit">Reset Password</button>
        <p>
        <a href="/login">Back to Login</a>
      </p>
      </form>
      
    </div>
  );
}

export default ForgotPasswordPage;
