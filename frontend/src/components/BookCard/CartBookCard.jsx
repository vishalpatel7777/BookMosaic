import React, { useState } from "react";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import CustomAlert from "../Alert/CustomAlert";

const API_URL = "https://bookmosaic.onrender.com";

const CartBookCard = ({ data, cart }) => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data._id,
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleRemoveBook = async () => {
    try {
      const response = await axios.put(`${API_URL}/api/v1/remove-book-from-cart`, {}, { headers });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      if (cart && typeof cart === "function") {
        cart((prevCart) => prevCart.filter((item) => item._id !== data._id));
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to remove book from cart");
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
        {Array(fullStars).fill(<FaStar />).map((star, index) => (
          <span key={`full-${index}`} className="text-yellow-400">{star}</span>
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
        {Array(emptyStars).fill(<FaRegStar />).map((star, index) => (
          <span key={`empty-${index}`} className="text-gray-300">{star}</span>
        ))}
      </span>
    );
  };

  return (
    <div className="hover:shadow-2xl p-2 rounded w-[250px] h-[400px] flex flex-col">
      <div className="rounded flex items-center justify-center">
        <img src={data.image} alt={data.title} className="p-3 h-[212px] w-[137px]" />
      </div>
      <h2 className="text-black text-xl font-semibold flex justify-center overflow-hidden" title={data.title}>
        {data.title || "Untitled"}
      </h2>
      <p className="text-black text-xl font-semibold flex justify-center">by {data.author}</p>
      <p className="text-black text-xl font-semibold relative left-[90px] justify-center">₹ {data.price}</p>
      <p className="text-black text-xl flex">Rating: {renderStars(data.ratings)}</p>
      <button
        className="bg-[#f8ca58] text-2xl px-8 py-2 rounded border mt-2"
        onClick={handleRemoveBook}
      >
        Remove from Cart
      </button>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default CartBookCard;