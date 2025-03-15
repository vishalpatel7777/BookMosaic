import React from "react";
import ThankYouImage from "../../assets/thank-you-page/thank-you.png";
import "../../assets/thank-you-page/thankyou.css"

const ThankYouPage = () => {
  const handleDownload = () => {
    // Add your logic for downloading the PDF file here
    alert("Your PDF download will start soon!");
  };

  return (
    <div className="thankyou relative min-h-screen  pt-[121px]">
      <img className="thank-you-img"
        src={ThankYouImage}
        alt="thankyou"
        style={{ maxWidth: "100%", height: "auto" }} // Optional inline styling
      />
      <button  className="thankyou-btn" onClick={handleDownload} style={buttonStyle}>
        Download your PDF file!!
      </button>
    </div>
  );
};

// Optional: Add custom styles
const buttonStyle = {
  backgroundColor: "#63918b",
  color: "#fff",
  padding: "10px 20px",
  fontSize: "16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "20px",
};

export default ThankYouPage;
