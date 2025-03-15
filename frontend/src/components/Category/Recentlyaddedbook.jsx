import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const API_URL = "https://bookmosaic.onrender.com";

const Recentlyaddedbook = () => {
  const [Book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/get-recent-books`);
        setBook(response.data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBook([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="mt-8 px-4 overflow-x-hidden">
      <div className="border-b-4 border-gray-400 flex items-center gap-4 px-4 pb-2">
        <span className="material-symbols-outlined text-4xl">family_star</span>
        <h2 className="text-3xl font-semibold font-caveat">Recently Added Books</h2>
        <a href="/allbooks">
          <div className="ml-260 flex items-center cursor-pointer">
            <h3 className="text-2xl">See all</h3>
            <span className="material-symbols-outlined text-2xl ml-2">keyboard_double_arrow_right</span>
          </div>
        </a>
      </div>
      {loading && (
        <div className="flex items-center justify-center mt-6">
          <Loader />
        </div>
      )}
      {!loading && Book && Book.length > 0 ? (
        <div className="my-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Book.map((item, i) => (
            <div key={i}><BookCard data={item} /></div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500 mt-6">No books available</p>
      )}
    </div>
  );
};

export default Recentlyaddedbook;