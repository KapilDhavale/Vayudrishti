// src/login/ForgotPasswordPage.js
import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase-config";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!");
        window.location.href = "/login";  // Redirect to login page
      })
      .catch((error) => {
        alert("Error: " + error.message);  // Display error message
      });
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      <p><a href="/login">Back to Login</a></p>
    </div>
  );
}

export default ForgotPasswordPage;
