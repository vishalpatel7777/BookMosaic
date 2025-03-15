import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../Loader/Loader";
import CustomAlert from "../../Alert/CustomAlert";

const API_URL = "https://bookmosaic.onrender.com";

const DeleteBook = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/get-all-books-search?search=${search}`);
      setBooks(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (bookId) => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setAlertMessage("You must be logged in as an admin to delete books.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`${API_URL}/api/v1/delete-book`, {
        headers: {
          "Content-Type": "application/json",
          id: userId,
          bookid: bookId,
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      setAlertMessage("Book deleted successfully");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to delete book");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  return (
    <div className="p-6 text-xl">
      <h2 className="text-2xl font-bold mb-4">Manage Books</h2>
      <input
        type="text"
        placeholder="Search by book name..."
        className="border p-2 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
      {!loading && (
        <table className="w-full border-collapse border border-[#91aeb2]">
          <thead>
            <tr className="bg-[#91aeb2]">
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Book Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book, index) => (
                <tr key={book._id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{book.title}</td>
                  <td className="border p-2">₹{book.price}</td>
                  <td className="border p-2">
                    <button
                      className="bg-[#a7490e] text-white px-4 py-1 rounded"
                      onClick={() => deleteBook(book._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border p-2 text-center">
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default DeleteBook;