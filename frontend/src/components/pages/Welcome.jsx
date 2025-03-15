import React, { useEffect } from "react";
import "../../assets/welcome-page/welcome.css";
import WelcomeVideo from "../../assets/welcome-page/banner.mp4";
import { useNavigate } from "react-router-dom";

const API_URL = "https://bookmosaic.onrender.com";

function Welcome() {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main className="welcome-page">
      <video autoPlay muted className="bg-welcome">
        <source src={WelcomeVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button className="go-button" onClick={() => navigate("/home")}>
        Here you go
      </button>
    </main>
  );
}

export default Welcome;
