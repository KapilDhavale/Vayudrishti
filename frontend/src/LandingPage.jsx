import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div id="landing-page">
      <div id="landing-image">
      <div id="landing-overlay">
      <div id="landing-buttons">
        <button
          style={{
            height:"40px",
            padding: "10px 20px",
            margin: "10px",
            fontSize: "1rem",
            fontFamily:"Inter",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#2F3336",
            color: "#fff",
            transition: "background-color 0.3s",
            alignItems:"center",
          }}
          onClick={() => navigate("/signup")}
        >
          REGISTER
        </button>
        <button
          style={{
            height:"40px",
            padding: "10px 20px",
            fontFamily:"Inter",
            margin: "10px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#31C400",
            color: "#fff",
            transition: "background-color 0.3s",
            alignItems:"center",
            marginRight:"40px",

          }}
          onClick={() => navigate("/login")}
        >
          LOGIN
        </button>
      </div>
      <div id="name-vayudrishti">
        <div id="vayu">Vayu</div>
        <div id="drishti">Drishti</div>
      </div>
      <div id="get-started">
        <button
          style={{
            height:"45px",
            width:"fit-content",
            padding: "0px 25px",
            margin: "10px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#2d88ff",
            color: "#fff",
            transition: "background-color 0.3s",
            alignItems:"center",
            justifyContent:"center",
            marginLeft:"50px",

          }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>
      <div id="landing-card">
        <div id="landing-card1">
          <div id="card1-head">Why VayuDrishti ?</div>
          <div id="card1-text">
            Vayudristhi delivers real-time, localized air quality data through
            an intuitive dashboard, empowering users to make informed decisions
            for a healthier environment. Unlike generic tools, it offers
            accurate insights, mobile compatibility, and actionable
            recommendations, bridging the gap between data and action. Choose
            Vayudristhi for accessible, meaningful air quality monitoring and a
            cleaner future.
          </div>
        </div>
        <div id="landing-card2">
          <div className="symbol">
            <img
              id="bell-img"
              src="/images/bell-icon.png"
              alt="Bell Icon"
              style={{ width: "13%", height: "auto" }}
            />
          </div>
          <div className="card-2-3-head">Advice for the public</div>
          <div id="card-2-3-text">
            Vayudristhi offers timely, localized air quality advisories,
            empowering individuals to take precautions and helping policymakers
            implement measures to protect public health. Stay informed and
            safeguard your community with Vayudristhi.
          </div>
        </div>
        <div id="landing-card3">
        <div className="symbol">
            <img
              id="bell-img"
              src="/images/aqi-meter.png"
              alt="Bell Icon"
              style={{ width: "25%", height: "auto" }}
            />
          </div>
          <div className="card-2-3-head">VayuDrishti <br></br>Dashboard</div>

        <div id="card-2-3-text">
            Vayudristhi offers timely, localized air quality advisories,
            empowering individuals to take precautions and helping policymakers
            implement measures to protect public health. Stay informed and
            safeguard your community with Vayudristhi.
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default LandingPage;