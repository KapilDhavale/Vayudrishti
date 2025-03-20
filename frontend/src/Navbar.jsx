import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css"; // Import Navbar-specific CSS

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar on the Landing Page or root route
  if (location.pathname === "/" || location.pathname === "/landing") {
    return null;
  }

  const handleNavigation = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
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
            <button onClick={() => handleNavigation("/database")} className="navbar-link">
              Database
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/analytics")} className="navbar-link">
              Analytics
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/maps")} className="navbar-link">
              Maps
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/social-media")} className="navbar-link">
              Social Media Analytics
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/realtime")} className="navbar-link">
              Real-Time Data
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
