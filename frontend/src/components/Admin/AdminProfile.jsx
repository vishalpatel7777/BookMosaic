import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://bookmosaic.onrender.com";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const headers = {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        if (!headers.id || !headers.authorization) {
          throw new Error("Missing authentication data");
        }
        const response = await axios.get(`${API_URL}/api/v1/get-admin-profile`, { headers });
        setAdmin(response.data);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        setError(error.response?.data?.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, []);

  if (loading) return <p className="text-center h-screen flex items-center justify-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!admin) return <p className="text-center">Error loading profile</p>;

  return (
    <div className="relative pt-[121px] overflow-x-hidden p-12 justify-center flex">
      <div className="justify-center items-center flex flex-col bg-[#e2e3e4] w-[35%] text-xl">
        <img
          src={admin.image || "placeholder.jpg"}
          alt="profile-pic"
          className="w-[151px] h-[151px] rounded-full object-cover mt-10"
        />
        <p className="border-1 rounded-full justify-center items-center w-30 bg-[#d4c134] mt-3 text-[24px] pl-4 pt-1 font-medium">
          @{admin.username}
        </p>
        <div className="box bg-white mt-5 p-7 shadow-md rounded-md mb-10">
          <p className="text-[24px] text-black font-semibold">
            Name: <span className="text-[24px] font-normal">{admin.fullname || "N/A"}</span>
          </p>
          <p className="text-[24px] text-black font-semibold">
            Email: <span className="text-[24px] font-normal">{admin.email || "N/A"}</span>
          </p>
          <p className="text-[24px] text-black font-semibold">
            Age: <span className="text-[24px] font-normal">{admin.age || "N/A"}</span>
          </p>
          <p className="text-[24px] text-black font-semibold">
            Favorite Book Genre: <span className="text-[24px] font-normal">{admin.genre || "N/A"}</span>
          </p>
          <p className="text-[24px] text-black font-semibold">
            Phone Number: <span className="text-[24px] font-normal">+91 {admin.phone || "N/A"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}