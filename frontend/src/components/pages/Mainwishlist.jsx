import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdFavorite } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import CustomAlert from "../Alert/CustomAlert";


const API_URL = "https://bookmosaic.onrender.com"; // Hardcoded for now

const Mainwishlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Book, setBook] = useState();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`${API_URL}/api/v1/get-book-by-id/${id}`);
      setBook(response.data.data);
    };
    fetch();
  }, [id]);

  const handleRemoveBook = async () => {
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
      bookid: Book?._id,
    };
    try {
      const response = await axios.put(`${API_URL}/api/v1/remove-book-from-wishlist`, {}, { headers });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      navigate("/profile/wishlist");
    } catch (error) {
      console.error("Error removing book:", error);
      setAlertMessage("Failed to remove book from wishlist");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  return (
    <div className="relative pt-[151px] overflow-x-hidden mt-8 px-4">
      <div className="border-b-4 border-gray-400 flex items-center gap-4 px-4 pb-2">
        <MdFavorite className="text-3xl" />
        <h2 className="text-3xl font-semibold font-caveat">Wishlist</h2>
      </div>
      {Book && (
        <div className="relative px-12 py-8 flex gap-8 overflow-x-hidden">
          <div className="rounded p-4 h-[80vh] w-2/6 flex items-center justify-center">
            <img
              src={Book.image}
              alt="/"
              className="h-[430px] shadow-[5px_20px_50px_rgba(0,0,0,0.4)] transform transition-all duration-500 hover:rotate-0 hover:scale-105"
            />
          </div>
          <div className="p-4 w-4/6">
            <div className="flex flex-row relative left-20 gap-2">
              <h1 className="text-[34px] text-black font-semibold">{Book.title}</h1>
              <p className="text-black text-[34px] font-semibold">By {Book.author}</p>
            </div>
            <div className="border-b-[3px] border-gray-300 top-2 relative w-[870px]"></div>
            <p className="text-black mt-10 text-2xl"><span className="font-semibold">Genre :</span> {Book.genre}</p>
            <p className="text-black mt-3 text-2xl"><span className="font-semibold">Subject : </span>{Book.subject}</p>
            <p className="text-black mt-4 text-2xl"><span className="font-semibold">Description : </span>{Book.desc}</p>
            <a
              href={Book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black mt-6 text-2xl flex flex-row items-center justify-start gap-2 text-blue-700 hover:text-blue-600"
            >
              <GrLanguage className="flex" /> Get more Info
            </a>
            <div className="gap-10 flex top-50 relative left-40">
              <div className="w-[195px] p-2 h-[49px] bg-[#edb953] rounded-4xl text-xl">
                <Link to="/profile/wishlist"><button className="pl-6.5 justify-center items-center">Back to Profile</button></Link>
              </div>
              <div className="relative left-[24px] w-[195px] p-2 h-[49px] bg-[#c15c54] rounded-4xl text-xl">
                <button className="pl-2.5 justify-center items-center" onClick={handleRemoveBook}>Remove from wishlist</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default Mainwishlist;