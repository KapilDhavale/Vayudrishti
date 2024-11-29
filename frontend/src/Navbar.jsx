import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import Navbar-specific CSS

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  // If not authenticated, redirect to login page
  const handleNavigation = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render Navbar if not authenticated
  }

  return (
    <div className="navbar">
     <div id="nav-logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
        <div id="nav-vayu">Vayu</div>
        <div id="nav-drishti">Drishti</div>
      </div>
      <nav className="navbar-nav">
        <ul className="navbar-links">
          <li>
            <button
              onClick={() => handleNavigation("/database")}
              className="navbar-link"
            >
              Database
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/analytics")}
              className="navbar-link"
            >
              Analytics
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/maps")}
              className="navbar-link"
            >
              Maps
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/social-media")}
              className="navbar-link"
            >
              Social Media Analytics
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
