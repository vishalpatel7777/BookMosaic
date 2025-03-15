import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import axios from "axios";
import FavoriteBookCard from "../BookCard/FavoriteBookCard";
import { FaHeart } from "react-icons/fa";
import "../../assets/wishlist-page/favorite.css";

const API_URL = "https://bookmosaic.onrender.com";

const Wishlist = () => {
  const [favorite, setFavorite] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/v1/get-all-wishlist`, { headers });
        setFavorite(response.data.data || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setFavorite([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <>
      {loading && <Loader />}
      {favorite.length === 0 && !loading && (
        <div className="h-screen flex items-center justify-center flex-col">
          <h1 className="text-4xl font-semibold text-zinc-700">Empty Wishlist</h1>
          <FaHeart
            className="favorite-pulse"
            style={{
              fontSize: "2.5rem",
              color: "#ff5555",
              marginBottom: "10px",
            }}
          />
        </div>
      )}
      {favorite.length > 0 && (
        <div className="relative pt-[129px] overflow-x-hidden p-10">
          <div className="border-b-4 border-[#bdbdbd] flex">
            <FaHeart
              className="favorite-icon"
              style={{
                fontSize: "2rem",
                color: "#ff5555",
                marginRight: "10px",
              }}
            />
            <h2 className="Favorite-Us text-3xl">Your Favorite</h2>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {favorite.map((book) => (
              <div key={book._id}>
                <FavoriteBookCard data={book} favorite={true} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;