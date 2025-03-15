import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomAlert from "../../Alert/CustomAlert";

const API_URL = "http://localhost:1000";

const EditBook = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    author: "",
    subject: "",
    genre: "",
    desc: "",
    price: "",
    language: "",
    image: "",
    ratings: "",
    pdf: null,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/get-all-books`);
      setBooks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormData({
      url: book.url || "",
      title: book.title || "",
      author: book.author || "",
      subject: book.subject || "",
      genre: book.genre || "",
      desc: book.desc || "",
      price: book.price || "",
      language: book.language || "",
      image: book.image || "",
      ratings: book.ratings || "",
      pdf: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === "file" ? files[0] : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleUpdate = async () => {
    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formPayload.append(key, formData[key]);
        }
      });
      if (formData.price) formPayload.set("price", parseFloat(formData.price));
      if (formData.ratings) formPayload.set("ratings", parseFloat(formData.ratings));

      await axios.put(`${API_URL}/api/v1/update-book/${selectedBook._id}`, formPayload, {
        headers: {
          id: localStorage.getItem("id"),
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAlertMessage("Book updated successfully");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        fetchBooks();
        setSelectedBook(null);
      }, 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to update book");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-xl">
      <h2 className="text-3xl font-semibold mb-4">Edit Books</h2>
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded w-full mb-4"
      />
      <ul className="space-y-2">
        {books
          .filter((book) => book.title.toLowerCase().includes(search.toLowerCase()))
          .map((book) => (
            <li key={book._id} className="flex justify-between bg-white p-3 shadow rounded">
              <span>{book.title} by {book.author}</span>
              <button
                onClick={() => handleEdit(book)}
                className="bg-[#37aba3] text-white px-4 py-1 rounded"
              >
                Edit
              </button>
            </li>
          ))}
      </ul>

      {selectedBook && (
        <div className="mt-6 bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Editing: {selectedBook.title}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="url" value={formData.url} onChange={handleChange} placeholder="URL" className="border p-2 rounded w-full" />
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded w-full" />
            <input type="text" name="desc" value={formData.desc} onChange={handleChange} placeholder="Description" className="border p-2 rounded w-full" />
            <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="border p-2 rounded w-full" />
            <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="border p-2 rounded w-full" />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="border p-2 rounded w-full" />
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="border p-2 rounded w-full" />
            <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" className="border p-2 rounded w-full" />
            <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Language" className="border p-2 rounded w-full" />
            <input type="number" name="ratings" value={formData.ratings} onChange={handleChange} placeholder="Ratings" className="border p-2 rounded w-full" />
            <input type="file" name="pdf" onChange={handleChange} className="border p-2 rounded w-full" accept="application/pdf" />
          </div>
          <button onClick={handleUpdate} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            Update Book
          </button>
        </div>
      )}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default EditBook;