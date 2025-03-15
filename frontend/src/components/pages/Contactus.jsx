import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "../../assets/contact-us-page/contactus.css";

function Contactus() {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
  
    const formData = new FormData(form.current);
    const userEmail = formData.get("email"); // Extract user email from form
  
    emailjs
      .sendForm(
        "service_vplid4c",  // Replace with your Service ID
        "template_wrbcsbe", // Replace with your Template ID
        form.current,
        "NpEuWp-f4uZXVdpn7"   // Replace with your Public Key
      )
      .then(
        (result) => {
      
          setIsSent(true);
          setError("");
  
          // Send confirmation email to the user
          emailjs.send(
            "service_vplid4c",
            "template_3xuakot", // This is a different template for user confirmation
            {
              to_email: userEmail, // Pass the user's email dynamically
              user_name: formData.get("name"),
              message: formData.get("message"),
            },
            "NpEuWp-f4uZXVdpn7"
          ).then(
            () => console.log("Confirmation email sent to user"),
            (err) => console.log("Error sending confirmation:", err)
          );
  
          form.current.reset();
        },
        (error) => {
          console.log("Error:", error.text);
          setIsSent(false);
          setError("Failed to send message. Try again later.");
        }
      );
  };
  

  return (
    <main className="relative min-h-screen pt-[121px]">
      <div className="container">
        <div className="contact-info">
          <div className="border-bottom-1">
            <span className="material-symbols-outlined" id="contact-icon">
              contact_phone
            </span>
            <h2 className="contact-Us">Contact Us</h2>
          </div>
          <div className="info-box-1">
            <h3>📍 Address</h3>
            <p>Bakrol Gate, Acet Boys Hostel, 388120</p>
          </div>
          <div className="info-box-2">
            <h3>📧 Email</h3>
            <p>patelvishal4642@gmail.com</p>

            <h3>📱 Mobile</h3>
            <p>+91 9265001227</p>

            <h3>💬 Whatsapp</h3>
            <p>+91 9265001227</p>
          </div>
        </div>
        <div className="contact-form">
          <div className="border-bottom-2">
            <h2 className="contact-Form">Contact Form</h2>
          </div>
          <form ref={form} onSubmit={sendEmail}>
            <div className="box">
              <label htmlFor="name">Name:</label>
              <input type="text" name="name" className="box-input" placeholder="Your name" required />

              <label htmlFor="email">Email:</label>
              <input type="email" name="email" className="box-input" placeholder="Your email" required />

              <label htmlFor="subject">Subject:</label>
              <input type="text" name="subject" className="box-input" placeholder="Subject" required />

              <label htmlFor="message">Message:</label>
              <textarea name="message" placeholder="Your message" required></textarea>

              <button type="submit">Send</button>

              {isSent && <p className="success-message">✅ Message sent successfully! Check your email for confirmation.</p>}
              {error && <p className="error-message">❌ {error}</p>}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Contactus;
