import React, { useEffect, useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = "https://bookmosaic.onrender.com";

const EditBook = () => {
  const location = useLocation();
  const isBasePath = location.pathname === "/admin/books";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/get-all-books`);
        setBooks(response.data.data || []);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="relative pt-[121px] overflow-x-hidden p-6">
      {isLoggedIn && role === "admin" && (
        <div className="gap-4 flex w-full p-4 h-auto bg-gray-100 shadow-lg rounded-xl">
          <div className="w-3/12 flex flex-col bg-[#e2e3e4] p-4 rounded-l-xl items-center">
            <h1 className="text-[40px] font-semibold mb-6 text-center">Manage Books</h1>
            <ul className="w-60 space-y-4 pt-10 pb-24 text-[20px]">
              {[
                { name: "Edit Books", path: "/admin/books/edit-books" },
                { name: "Add Book", path: "/admin/books/add-book" },
                { name: "Delete Book", path: "/admin/books/delete-book" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-black hover:text-blue-500 transition duration-300 bg-white p-2 block rounded-md"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-10/12 bg-white p-6 shadow-lg rounded-r-xl overflow-y-auto">
            {isBasePath ? (
              <div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-bold mb-4">Book List</h1>
                  <h3 className="text-2xl font-semibold mb-2">Total Books: {books.length}</h3>
                </div>
                {loading ? (
                  <p>Loading books...</p>
                ) : (
                  <table className="w-full border-collapse border border-gray-300 text-xl">
                    <thead>
                      <tr className="bg-[#91aeb2] text-left">
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">Title</th>
                        <th className="border border-gray-300 px-4 py-2">Author</th>
                        <th className="border border-gray-300 px-4 py-2">Genre</th>
                        <th className="border border-gray-300 px-4 py-2">Price</th>
                        <th className="border border-gray-300 px-4 py-2">Rating (max=5)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.length > 0 ? (
                        books.map((book, i) => (
                          <tr key={book._id} className="border border-gray-300 hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{i + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{book.title}</td>
                            <td className="border border-gray-300 px-4 py-2">{book.author}</td>
                            <td className="border border-gray-300 px-4 py-2">{book.genre}</td>
                            <td className="border border-gray-300 px-4 py-2">₹{book.price}</td>
                            <td className="border border-gray-300 px-4 py-2">{book.ratings || "Not rated"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-gray-500">No books found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBook;