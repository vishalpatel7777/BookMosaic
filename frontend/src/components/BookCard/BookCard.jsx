import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const BookCard = ({ data }) => {
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

  return (
    <Link to={`/view-book-details/${data._id}`}>
      <div className="hover:shadow-2xl p-2 rounded w-[350px] h-[450px] flex flex-col">
        <div className="rounded flex items-center justify-center">
          <img src={data.image} alt="/" className="p-5 h-[312px] w-[197px]" />
        </div>
        <div>
          <h2
            className="text-black text-xl font-semibold flex justify-center  overflow-hidden"
            title={data.title}
          >
            {data.title || "Untitled"}
          </h2>

          <p className="text-black mt-1 text-xl font-semibold flex justify-center">
            by {data.author}
          </p>
        </div>
        <p className="text-black text-xl mt-1 font-semibold relative left-[130px] justify-center">
          ₹ {data.price}
        </p>
        <p className="text-black text-xl mt-1 flex font-semibold relative bottom-3">
          &nbsp; &nbsp; Rating: &nbsp; {renderStars(data.ratings)}{" "}
        </p>
      </div>
    </Link>
  );
};

export default BookCard;
