import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { GrLanguage } from "react-icons/gr";
import { IoIosHeart } from "react-icons/io";
import { FaCartArrowDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa6";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import CustomAlert from "../Alert/CustomAlert";

const API_URL = "https://bookmosaic.onrender.com";

const ViewBookDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [Book, setBook] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Define max length for truncated description
  const DESCRIPTION_MAX_LENGTH = 150;

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/get-book-by-id/${id}`);
        setBook(response.data.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        setBook(null);
      }
    };
    fetch();
  }, [id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const handleWishlist = async () => {
    try {
      const response = await axios.put(`${API_URL}/api/v1/add-to-wishlist`, {}, { headers });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to add to wishlist");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  const handleAddtocart = async () => {
    try {
      const response = await axios.put(`${API_URL}/api/v1/add-to-cart`, {}, { headers });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to add to cart");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  const renderStars = (rating) => {
    const maxStars = 5;
    const ratingValue = rating || 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="flex items-center">
        {Array(fullStars)
          .fill(<FaStar />)
          .map((star, index) => (
            <span key={`full-${index}`} className="text-yellow-400">
              {star}
            </span>
          ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
        {Array(emptyStars)
          .fill(<FaRegStar />)
          .map((star, index) => (
            <span key={`empty-${index}`} className="text-gray-300">
              {star}
            </span>
          ))}
      </span>
    );
  };

  const getTruncatedDescription = (desc) => {
    if (!desc) return "";
    return desc.length > DESCRIPTION_MAX_LENGTH && !showFullDescription
      ? `${desc.substring(0, DESCRIPTION_MAX_LENGTH)}...`
      : desc;
  };

  return (
    <>
      {Book === null && (
        <div className="h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}
      {Book && (
        <div className="relative pt-[148px] px-12 py-8 flex gap-8 overflow-x-hidden">
          <FaArrowLeft className="text-2xl" onClick={() => navigate(-1)} />
          <div className="rounded p-4 h-[80vh] w-2/6 flex items-center justify-center">
            <img
              src={Book.image}
              alt="/"
              className="h-[500px] shadow-[5px_20px_50px_rgba(0,0,0,0.7)] transform transition-all duration-500 hover:rotate-0 hover:scale-105"
            />
          </div>
          <div className="p-4 w-4/6">
            <div className="flex flex-row relative left-20 gap-2">
              <h1 className="text-[34px] text-black font-semibold">
                {Book.title}
              </h1>
              <p className="text-black text-[34px] font-semibold">
                By {Book.author}
              </p>
            </div>
            <div className="border-b-[3px] border-gray-300 top-2 relative w-[870px]"></div>
            <p className="text-black mt-10 text-2xl">
              <span className="font-semibold">Genre :</span> {Book.genre}
            </p>
            <p className="text-black mt-3 text-2xl">
              <span className="font-semibold">Subject : </span>
              {Book.subject}
            </p>
            <p className="text-black mt-4 text-2xl">
              <span className="font-semibold">Description : </span>
              {getTruncatedDescription(Book.desc)}
              {Book.desc && Book.desc.length > DESCRIPTION_MAX_LENGTH && (
                <button
                  className="text-blue-700 hover:text-blue-600 ml-2 font-medium"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Read Less" : "Read More"}
                </button>
              )}
            </p>
            <a
              href={Book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black mt-6 text-2xl flex flex-row items-center justify-start gap-2 text-blue-700 hover:text-blue-600"
            >
              <GrLanguage className="flex" />
              Get more Info
            </a>
            <p className="text-black mt-4 text-2xl flex">
              Rating:   {renderStars(Book.ratings)}
            </p>

            {isLoggedIn === true && role === "user" && (
              <div className="gap-10 flex top-50 relative left-80">
                <div>
                  <button
                    className="text-5xl cursor-pointer text-red-500 hover:text-red-700 transition duration-300"
                    onClick={handleWishlist}
                  >
                    <IoIosHeart />
                  </button>
                </div>
                <Link to={`/buy/${Book._id}`}>
                  <button className="w-[165px] h-[59px] bg-[#edb953] rounded-4xl text-2xl">
                    Buy
                  </button>
                </Link>
                <div className="w-[185px] p-2 h-[59px] bg-[#c15c54] rounded-4xl text-2xl">
                  <button
                    className="flex flex-row gap-4 pt-1 pl-1.5 justify-center items-center"
                    onClick={handleAddtocart}
                  >
                    Add to Cart <FaCartArrowDown />
                  </button>
                </div>
              </div>
            )}

            {isLoggedIn === true && role === "admin" && (
              <div className="gap-10 flex top-50 relative left-80">
                <div className="w-[185px] p-2 h-[59px] bg-[#c15c54] rounded-4xl text-2xl">
                  <button className="flex flex-row gap-4 pt-1 pl-1.5 justify-center items-center">
                    <AiFillDelete />
                  </button>
                </div>
                <div className="w-[185px] p-2 h-[59px] bg-[#edb953] rounded-4xl text-2xl">
                  <button className="flex flex-row gap-4 pt-1 pl-1.5 justify-center items-center">
                    <FaEdit />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
};

export default ViewBookDetails;