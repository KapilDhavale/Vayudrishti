import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StarterPage = () => {
  const [fadeOut, setFadeOut] = useState(false); // State to control the fade effect
  const navigate = useNavigate();

  useEffect(() => {
    // Set the fade-out effect after 1 second
    const timer = setTimeout(() => {
      setFadeOut(true); // Trigger fade-out effect
    }, 900); // Start the fade effect after 1 second

    // Redirect after the transition
    const redirectTimer = setTimeout(() => {
      navigate("/landing"); // Redirect to login after fade-out completes
    }, 3000); // Wait for the transition to complete before navigating

    return () => {
      clearTimeout(timer); // Cleanup timer on unmount
      clearTimeout(redirectTimer); // Cleanup redirect timer
    };
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full height of the viewport
        width: "100vw", // Full width of the viewport
        position: "relative", // To position the overlay properly
        backgroundImage: `url('/images/starterpage.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "opacity 1s ease-out", // Smooth opacity transition
        opacity: fadeOut ? 0 : 1, // Fade out the entire screen
      }}
    >
      {/* Transparent black overlay */}
      <div
        style={{
          position: "absolute", // Make sure it's positioned on top of the background
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Black color with 50% opacity
          transition: "opacity 1s ease-out", // Smooth opacity transition
          opacity: fadeOut ? 0 : 1, // Fade out the overlay as well
        }}
      ></div>

      {/* Text content */}
      <div
        style={{
          position: "relative", // Ensure text is above the overlay
          color: "#fff",
          fontSize: "7vw",
          fontFamily: "Inter",
          fontWeight: "700",
          letterSpacing: "5px",
          transition: "opacity s ease-out", // Smooth opacity transition
          opacity: fadeOut ? 0 : 1, // Fade out the text as well
        }}
      >
        VayuDrishti
      </div>
    </div>
  );
};

export default StarterPage;
