import { useState, useEffect } from "react";
import axios from "axios";
import CustomAlert from "../Alert/CustomAlert";

const API_URL = "http://localhost:1000";

export default function AdminSettings() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    age: "",
    genre: "",
    phone: "",
    image: "",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const headers = {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.get(`${API_URL}/api/v1/get-admin-profile`, { headers });
        setAdmin(response.data);
        setFormData({
          fullname: response.data.fullname || "",
          email: response.data.email || "",
          age: response.data.age || "",
          genre: response.data.genre || "",
          phone: response.data.phone || "",
          image: response.data.image || "",
        });
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const response = await axios.put(`${API_URL}/api/v1/update-admin-profile`, formData, { headers });
      setAdmin(response.data);
      setAlertMessage("Profile updated successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to update profile");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) {
      setAlertMessage("Please fill in both password fields");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }
    try {
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const response = await axios.put(
        `${API_URL}/api/v1/update-admin-profile`,
        { oldPassword: passwords.oldPassword, password: passwords.newPassword },
        { headers }
      );
      setAlertMessage("Password updated successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to change password");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!admin) return <p>Error loading profile</p>;

  return (
    <div className="relative pt-[121px] overflow-x-hidden p-12 flex justify-center">
      <div className="bg-white p-6 w-[40%] rounded-lg shadow-2xl text-xl">
        <h2 className="text-3xl font-semibold text-center mb-6">Admin Settings</h2>
        <div className="flex flex-col items-center">
          <img
            src={formData.image || "https://via.placeholder.com/151"}
            alt="Profile Pic"
            className="w-[151px] h-[151px] rounded-full object-cover mb-4"
          />
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="Enter profile picture URL"
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="mt-4">
          <label className="block text-xl">Full Name:</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-[#fcf6db] border-[#fcf6db]"
          />
          <label className="block text-xl mt-3">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-[#fcf6db] border-[#fcf6db]"
          />
          <label className="block text-xl mt-3">Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-[#fcf6db] border-[#fcf6db]"
          />
          <label className="block text-xl mt-3">Favorite Book Genre:</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-[#fcf6db] border-[#fcf6db]"
          />
          <label className="block text-xl mt-3">Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-[#fcf6db] border-[#fcf6db]"
          />
          <button
            onClick={handleUpdateProfile}
            className="mt-5 text-xl w-full bg-[#37aba3] text-white p-2 rounded hover:bg-[#37aba3d8]"
          >
            Update Profile
          </button>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Change Password</h3>
          <label className="block text-lg mt-3">Old Password:</label>
          <input
            type="password"
            name="oldPassword"
            className="w-full p-2 border rounded bg-[#fcf6db] border-[#fcf6db]"
            placeholder="Enter old password"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
          />
          <label className="block text-lg mt-3">New Password:</label>
          <input
            type="password"
            name="newPassword"
            className="w-full p-2 border rounded bg-[#fcf6db] border-[#fcf6db]"
            placeholder="Enter new password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
          />
          <button
            onClick={handleChangePassword}
            className="mt-5 w-full bg-[#c25352] text-xl text-white p-2 rounded hover:bg-[#c25452d2]"
          >
            Change Password
          </button>
        </div>
      </div>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}