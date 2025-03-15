import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from "../Loader/Loader";
import CustomAlert from "../Alert/CustomAlert";

const API_URL = "https://bookmosaic.onrender.com";

const EditProfile = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [ProfileData, setProfileData] = useState(null);
  const [Values, setValues] = useState({
    age: "",
    genre: "",
  });

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/user-information`, { headers });
        setProfileData(response.data);
        setValues({ age: response.data.age || "", genre: response.data.genre || "" });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileData(null);
      }
    };
    fetch();
  }, []);

  const submitinfo = async () => {
    try {
      const response = await axios.put(`${API_URL}/api/v1/update`, Values, { headers });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to update profile");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  return (
    <div>
      {ProfileData === null && (
        <div className='h-screen flex items-center justify-center'>
          <Loader />
        </div>
      )}
      {ProfileData && (
        <div className='h-[100%] p-0 text-black'>
          <div>
            <h1 className='text-3xl ml-2 font-semibold'>Settings</h1>
            <div className="border-b-[4px] border-gray-400 rounded-2xl top-2 mb-8 relative w-[870px]"></div>
          </div>
          <div className='flex gap-5 flex-col p-2'>
            <div className='flex'>
              <label className='font-semibold text-2xl'>Username :</label>
              <p className='ml-4 p-[3px] border-2 border-[#a7490e] w-[200px] justify-center flex items-center rounded-full bg-[#a7490e]'>
                @{ProfileData.username}
              </p>
            </div>
            <div className='flex'>
              <label className='font-semibold text-2xl'>Email :</label>
              <p className='ml-12 p-[3px] border-2 border-[#a7490e] w-[200px] justify-center flex items-center rounded-full bg-[#a7490e]'>
                {ProfileData.email}
              </p>
            </div>
            <div className='flex'>
              <label className='font-semibold text-2xl'>Phone No. :</label>
              <p className='ml-4 p-[3px] border-2 border-[#a7490e] w-[200px] justify-center flex items-center rounded-full bg-[#a7490e]'>
                +91 {ProfileData.phone}
              </p>
            </div>
            <div className='flex mt-3'>
              <label className='font-semibold text-2xl'>Age :</label>
              <input
                type="number"
                name="age"
                id="age"
                value={Values.age}
                className='ml-17 p-[3px] border-2 border-[#91aeb2] w-[200px] justify-center flex items-center rounded-full bg-[#91aeb2]'
                placeholder='1'
                required
                onChange={change}
              />
            </div>
            <div className='flex'>
              <label className='font-semibold text-2xl'>Favorite genre :</label>
              <input
                type="text"
                name="genre"
                id="genre"
                className='ml-3 p-[3px] border-2 border-[#91aeb2] w-[200px] justify-center flex items-center rounded-full bg-[#91aeb2]'
                placeholder='Favorite genre'
                required
                value={Values.genre}
                onChange={change}
              />
            </div>
            <div className='flex ml-90 mt-10'>
              <button
                className='p-3 text-3xl font-semibold border-2 border-[#37aba3] w-[200px] justify-center flex items-center rounded-full bg-[#37aba3] hover:bg-[#72e1d9] hover:border-[#72e1]'
                onClick={() => {
                  submitinfo();
                  setTimeout(() => window.location.reload(), 500);
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default EditProfile;