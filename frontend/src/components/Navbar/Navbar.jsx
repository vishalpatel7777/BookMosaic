import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateRoutes } from "../../store/routesSlice";
import BookCard from "../BookCard/BookCard";

const API_URL = "http://localhost:1000";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const routes = useSelector((state) => state.routes);

  useEffect(() => {
    dispatch(updateRoutes({ isLoggedIn }));
  }, [isLoggedIn, dispatch]);

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.trim() === "") {
      setBooks([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/get-all-books-search?search=${searchValue}`);
      const data = await response.json();
      if (data.status === "success") {
        setBooks(data.data);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  return (
    <nav className="navbar fixed top-0 left-0 w-full bg-white z-50 p-4 flex justify-between items-center">
      <div className="logo-container">
        <img src="../src/assets/home-page/l.png" alt="BookMosaic Logo" className="w-20" />
      </div>
      <ul className="nav-links flex gap-4">
        {routes.map((route) => (
          <li key={route.path} className="hover:text-blue-500">
            <Link to={route.path}>{route.component}</Link>
          </li>
        ))}
      </ul>
      {isLoggedIn && (
        <div className="icons flex gap-3">
          <Link to="/wishlist" className="hover:text-red-500">
            <span className="material-symbols-outlined">favorite</span>
          </Link>
          <Link to="/addtocart" className="hover:text-blue-500">
            <span className="material-symbols-outlined">shopping_cart</span>
          </Link>
          <Link to="/notification" className="hover:text-blue-500">
            <span className="material-symbols-outlined">notifications</span>
          </Link>
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          placeholder="Find your Book"
          value={query}
          onChange={handleSearch}
          className="border p-2 rounded-md"
        />
        <i className="search-icon absolute right-3 top-2">🔍</i>
        {books.length > 0 && (
          <div className="absolute top-16 left-[calc(50%-300px)] transform -translate-x-1/2 bg-white shadow-2xl w-[760px] max-h-[500px] overflow-auto mt-2 p-4 rounded-lg z-50 overflow-x-hidden">
            <div className="grid grid-cols-2 gap-3">
              {books.map((book) => (
                <Link to={`/view-book-details/${book._id}`} key={book._id}>
                  <div
                    onClick={() => {
                      setBooks([]);
                      setQuery("");
                    }}
                  >
                    <BookCard data={book} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;