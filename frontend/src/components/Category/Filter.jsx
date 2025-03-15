import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import BookCard from "../BookCard/BookCard";
import CustomAlert from "../Alert/CustomAlert";

const API_URL = "http://localhost:1000";

const Filter = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const genres = [
    { icon: "📖", name: "The Bestseller Vault" },
    { icon: "🕰", name: "Timeless Classics" },
    { icon: "🌌", name: "Beyond Reality" },
    { icon: "🖤", name: "Dark & Twisted" },
    { icon: "❤️", name: "Love & Luxe" },
    { icon: "🛠", name: "The Mind Forge" },
    { icon: "📜", name: "The Collector's Shelf" },
    { icon: "👑", name: "Royal Reads" },
    { icon: "🌍", name: "Globe Trotter Tales" },
    { icon: "🟣", name: "The Forbidden Section" },
    { icon: "💼", name: "The CEO's Library" },
    { icon: "🧠", name: "The Thinker's Nook" },
    { icon: "⚡", name: "Speed Read Express" },
    { icon: "🎭", name: "The Drama Stage" },
    { icon: "📚", name: "Aesthetic Shelf" },
    { icon: "👶", name: "Little Dreamers" },
    { icon: "📢", name: "Viral Reads" },
    { icon: "☕", name: "Cozy Corner" },
    { icon: "🎬", name: "Read & Watch" },
    { icon: "🧳", name: "The Travel Shelf" },
  ];

  const chunkArray = (arr, size) => {
    return arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
  };

  const genreRows = chunkArray(genres, 4);

  const handleGenreSelect = (genreName) => {
    setSelectedGenres((prev) =>
      prev.includes(genreName) ? prev.filter((g) => g !== genreName) : [...prev, genreName]
    );
  };

  const fetchBooksByGenres = async () => {
    if (selectedGenres.length === 0) {
      setAlertMessage("Please select at least one genre.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    setLoading(true);
    try {
      const selectedGenre = selectedGenres[0];
      const sanitizeGenre = (genre) => genre.replace(/[’‘]/g, "'");
      const sanitizedGenre = sanitizeGenre(selectedGenre);
      const apiUrl = `${API_URL}/api/v1/get-books-by-genre?genre=${encodeURIComponent(sanitizedGenre)}`;
      const response = await axios.get(apiUrl);
      setBooks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
      setAlertMessage("Error fetching books.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white text-black isolate">
      <div className="border rounded-lg p-12 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Genre</h2>
        <div className="flex flex-col gap-2">
          {genreRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 ${rowIndex % 2 === 0 ? "pt-1 pb-2 relative right-1" : "pt-1 pb-2 relative left-19"}`}
            >
              {row.map((genre, index) => (
                <button
                  key={index}
                  className={`flex font-semibold items-center justify-center gap-2 w-[90%] py-3 ${selectedGenres.includes(genre.name) ? "bg-[#c87e70]" : "bg-[#bdbcbb]"} text-black text-xl rounded-full shadow-md hover:bg-[#c87e70] focus:outline-none`}
                  onClick={() => handleGenreSelect(genre.name)}
                >
                  <span>{genre.icon}</span>
                  {genre.name}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={fetchBooksByGenres}
            className="bg-[#c25352] text-2xl text-black px-10 py-2 rounded-3xl hover:bg-[#ad2732] focus:outline-none"
            disabled={loading}
          >
            Filter
          </button>
        </div>
        {loading && (
          <div className="flex items-center justify-center mt-6">
            <Loader />
          </div>
        )}
        {!loading && books && books.length > 0 && (
          <div className="my-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {books.map((item, i) => (
              <BookCard key={i} data={item} />
            ))}
          </div>
        )}
        {!loading && books && books.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No books found for selected genre.</p>
        )}
      </div>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default Filter;