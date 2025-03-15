import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

const API_URL = "https://bookmosaic.onrender.com";

const RecommendedBooks = () => {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const bookCardWidth = 350;

  const navigate = useNavigate();
  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        const headers = {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        if (!headers.id || !headers.authorization) {
          throw new Error("User not logged in");
        }
        const response = await axios.get(
          `${API_URL}/api/v1/get-recommended-books`,
          { headers }
        );
        setBooks(response.data.data || []);
      } catch (error) {
        console.error("Error fetching recommended books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendedBooks();
  }, []);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + books.length) % books.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
  };

  return (
    <div className="mt-8 px-4 overflow-x-hidden">
      <div className="border-b-4 border-gray-400 flex items-center gap-4 px-4 pb-2">
        <span className="material-symbols-outlined text-4xl">recommend</span>
        <h2 className="text-3xl font-semibold font-caveat">
          Recommended Books
        </h2>
       <div onClick={() => navigate("/allbooks")}>
          <div className="ml-auto flex items-center cursor-pointer">
            <h3 className="text-2xl">See all</h3>
            <span className="material-symbols-outlined text-2xl ml-2">
              keyboard_double_arrow_right
            </span>
          </div>
          </div>
      </div>
      {loading && (
        <div className="flex items-center justify-center mt-6">
          <Loader />
        </div>
      )}
      {!loading && books && books.length > 0 ? (
        <div className="relative my-9">
          <div
            ref={sliderRef}
            className="overflow-hidden w-full"
            style={{ maxWidth: `${bookCardWidth}px`, margin: "0 auto" }}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * bookCardWidth}px)`,
                width: `${books.length * bookCardWidth}px`,
              }}
            >
              {books.map((item, i) => (
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{ width: `${bookCardWidth}px` }}
                >
                  <BookCard data={item} />
                </div>
              ))}
            </div>
          </div>
          {books.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <div className="flex justify-center mt-4 space-x-2">
                {books.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full ${
                      i === currentIndex ? "bg-gray-800" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-500 mt-6">
            No recommendations available
          </p>
        )
      )}
    </div>
  );
};

export default RecommendedBooks;
