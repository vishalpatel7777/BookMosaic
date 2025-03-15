import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import WishlistBookCard from "../BookCard/WishlistBookCard";
import { FaBook } from "react-icons/fa";

const API_URL = "http://localhost:1000";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
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
        setWishlist(response.data.data || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <>
      {loading && (
        <div className="h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}
      {!loading && wishlist.length === 0 && (
        <div
          className="text-4xl font-semibold flex text-zinc-700 h-[100%] items-center justify-center gap-5"
          style={{ textAlign: "center", padding: "20px" }}
        >
          <p>No Books In Your Wishlist</p>
          <FaBook
            className="book-pulse"
            style={{ fontSize: "2.5rem", color: "#c87e70", marginBottom: "10px" }}
          />
        </div>
      )}
      {!loading && wishlist.length > 0 && (
        <div>
          <h1 className="text-3xl ml-2 font-semibold">Wishlist</h1>
          <div className="border-b-[4px] border-gray-400 rounded-2xl top-2 mb-8 relative w-[870px]"></div>
          <div className="grid grid-cols-3">
            {wishlist.map((book) => (
              <div key={book._id}>
                <WishlistBookCard data={book} wishlist={true} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;