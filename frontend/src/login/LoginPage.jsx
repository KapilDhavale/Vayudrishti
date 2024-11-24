// src/login/LoginPage.js
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "/dashboard"; // Redirect to dashboard directly
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  return (
    <div className="login">
      {/* Transparent overlay */}
      <div className="overlay"></div>

      <div id="vayudrishti">VayuDrishti</div>

      <form onSubmit={handleLogin}>
        {/* Wrap form fields in the new container */}
        <div className="form-content">
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
        </div>

        <button type="submit">Login</button>
        <p>
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
