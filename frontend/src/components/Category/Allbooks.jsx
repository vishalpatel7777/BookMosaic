import React, { useEffect, useState } from 'react';
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const API_URL = "https://bookmosaic.onrender.com";

const Allbooks = () => {
  const [Book, setBook] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/get-all-books`);
        setBook(response.data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBook(null);
      }
    };
    fetch();
  }, []);

  return (
    <div className="mt-10 px-4 relative top-[75px] mb-20 overflow-x-hidden">
      <div className="Cart-border-bottom-1">
        <span className="material-symbols-outlined" id="Cart-icon">family_star</span>
        <h2 className="Cart-Us">All Books</h2>
      </div>
      {Book === null && (
        <div className="h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="my-9 relative left-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Book && Book.map((items, i) => (
          <div key={i}><BookCard data={items} /></div>
        ))}
      </div>
    </div>
  );
};

export default Allbooks;