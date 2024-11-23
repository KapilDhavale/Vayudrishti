// src/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: `url('/images/landingpage.jpg')`, // Replace with your background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'black',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Welcome to VayuDrishti</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px', textAlign: 'center' }}>
        Explore air quality insights and analytics.
      </p>
      <div>
        <button
          style={{
            padding: '10px 20px',
            margin: '10px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#2d88ff',
            color: '#fff',
            transition: 'background-color 0.3s',
          }}
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          style={{
            padding: '10px 20px',
            margin: '10px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#555',
            color: '#fff',
            transition: 'background-color 0.3s',
          }}
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
