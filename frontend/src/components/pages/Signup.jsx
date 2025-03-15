import React, { useState, useEffect } from 'react';
import "../../assets/signup-page/signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'react-phone-input-2/lib/style.css';
import ImageUpload from "../Profile/ImageUpload";
import CustomAlert from "../Alert/CustomAlert";

const API_URL = "http://localhost:1000";

const Signup = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [step, setStep] = useState(1);
  const [Values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    genre: "",
    fullname: "",
    phone: "",
    image: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const validateStep1 = async () => {
    if (!Values.fullname || !Values.email || !Values.username || !Values.age || !Values.genre) {
      setAlertMessage("Please fill all the fields in this step");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/v1/validate-step1`, {
        email: Values.email,
        username: Values.username,
      });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      setStep(2);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error validating Step 1");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  const validateStep2 = async () => {
    if (!Values.phone || Values.phone.length < 10) {
      setAlertMessage("Please enter a valid phone number");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/v1/validate-step2`, {
        phone: Values.phone,
      });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      setStep(3);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error validating Step 2");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  const submit = async () => {
    if (!Values.password || Values.password.length < 6) {
      setAlertMessage("Please enter a password of at least 6 characters");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    if (Values.password !== Values.confirmPassword) {
      setAlertMessage("Passwords do not match");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    if (!Values.image) {
      setAlertMessage("Please upload a profile image");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/v1/signup`, Values);
      setAlertMessage("Signup successful! Please check your email to verify your account.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/login");
      }, 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error during signup");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  return (
    <main className='all relative min-h-screen pt-[121px]'>
      <div className="background-img">
        <img src="../src/assets/signup-page/background.png" alt="background-img" className="img" />
        <div className="signup-header">
          <img src="../src/assets/signup-page/book-box.png" alt="signup1" className="left" />
          <h1 className="signup">Signup</h1>
          <img src="../src/assets/signup-page/book-box.png" alt="signup2" className="right" />
        </div>

        <div className="signup-box">
          {step === 1 && (
            <>
              <label htmlFor="fullname" className='fullname'>Full Name:</label>
              <input type="text" id='fullname' name='fullname' className='input-fullname' placeholder='Firstname Lastname' value={Values.fullname} onChange={change} />
              <label htmlFor="email" className="email">Email:</label>
              <input type="email" name="email" id="email" className="input-email" placeholder='User07@gmail.com' value={Values.email} onChange={change} />
              <label htmlFor="username" className='username'>Username:</label>
              <input type="text" id='username' name='username' className='input-username' placeholder='User07' value={Values.username} onChange={change} />
              <label htmlFor="age" className='age'>Age:</label>
              <input type="number" name="age" id="age" value={Values.age} onChange={change} className='input-age' placeholder='1' />
              <label htmlFor="genre" className='genre'>Genre:</label>
              <input type="text" name="genre" id="genre" className='input-genre' placeholder='Enter your favorite book genre' value={Values.genre} onChange={change} />
              <button className="signupbtn" onClick={validateStep1}>Next</button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="phone-input-container">
                <label htmlFor="phone" className="phone">Phone Number: <span className="country-code">+91</span></label>
                <input type="tel" name="phone" id="phone" className="input-phone" placeholder="1234567890" value={Values.phone} onChange={change} />
              </div>
              <label htmlFor="password" className="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                className="input-pass"
                placeholder="Enter your password"
                value={Values.password}
                onChange={change}
                onFocus={(e) => e.target.type = 'text'}
                onBlur={(e) => e.target.type = 'password'}
              />
              <label htmlFor="confirmPassword" className="confirm-password">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="input-confirm-pass"
                placeholder='Confirm your password'
                value={Values.confirmPassword}
                onChange={change}
                onFocus={(e) => e.target.type = 'text'}
                onBlur={(e) => e.target.type = 'password'}
              />
              <div className='signup-image relative text-[23px] right-[920px] top-40'>
                <ImageUpload onImageSelect={(image) => setValues({ ...Values, image })} />
              </div>
              <button className="signupbtn2" onClick={submit}>Submit</button>
            </>
          )}
        </div>

        <div className="signup-right">
          <img src="../src/assets/signup-page/siiting.png" alt="sitting" className="sitting2" />
          <img src="../src/assets/signup-page/sitting.png" alt="sitting" className="sitting1" />
        </div>
      </div>

      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </main>
  );
};

export default Signup;