import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateRoutes } from "../../store/routesSlice";
import { authActions } from "../../store/auth";
import BookCard from "../BookCard/BookCard";
import AdminNavLogo from "../../assets/home-page/l.png";

const API_URL = "https://bookmosaic.onrender.com";

const AdminNavbar = () => {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      dispatch(authActions.logout());
      dispatch(authActions.changeRole("user"));
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <nav className="navbar fixed top-0 left-0 w-full bg-white z-50 p-4 flex justify-between items-center">
      <div className="logo-container">
        <img src={AdminNavLogo} alt="BookMosaic Logo" className="w-20" />
      </div>
      <ul className="nav-links flex gap-4">
        <li className="hover:text-blue-500"><Link to="/admin/home">Home</Link></li>
        <li className="hover:text-blue-500"><Link to="/admin/dashboard">Dashboard</Link></li>
        <li className="hover:text-blue-500"><Link to="/admin/users">Manage Users</Link></li>
        <li className="hover:text-blue-500"><Link to="/admin/books">Manage Books</Link></li>
        <li className="hover:text-blue-500"><Link to="/admin/settings">Settings</Link></li>
      </ul>
      {isLoggedIn && (
        <div className="flex gap-3">
          <Link to="/admin/profile" className="hover:text-gray-300">
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
          <button onClick={handleLogout} className="hover:text-red-400">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;