// src/login/SignupPage.js
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import "./SignupPage.css";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return; // You can display an error here
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "/dashboard";  // Redirect to dashboard directly after signup
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  return (
    <div className="login">
      {/* Transparent overlay */}
      <div className="overlay"></div>

      <div id="vayudrishti">
        VayuDrishti
      </div>
      
      <form onSubmit={handleSignup}>
        {/* Wrap form fields in the new container */}
        <div className="signup-form-content">
          <div className="input-container">
            <label htmlFor="email">Email ID:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
        </div>

        <button type="submit">Sign Up</button>
        <p><a href="/login">Already have an account? Log in</a></p>
      </form>
    </div>
  );
}

export default SignupPage;
