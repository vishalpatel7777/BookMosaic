import React, { useEffect } from 'react';
import "../../assets/welcome-page/welcome.css";

const API_URL = "https://bookmosaic.onrender.com";

function Welcome() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main className="welcome-page">
      <video autoPlay muted className="bg-welcome">
        <source src="../src/assets/welcome-page/banner.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <a href="/home"><button className='go-button'>Here you go</button></a>
    </main>
  );
}

export default Welcome;