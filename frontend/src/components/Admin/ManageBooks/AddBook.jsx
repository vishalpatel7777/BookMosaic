import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomAlert from "../../Alert/CustomAlert";

const API_URL = "http://localhost:1000";

const AddBook = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
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
  });

  const [pdfFile, setPdfFile] = useState(null);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const submit = async () => {
    if (!values.title || !values.author || !values.price || !pdfFile) {
      setAlertMessage("Title, Author, Price, and PDF are required!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key]) formData.append(key, values[key]);
      });
      formData.append("pdf", pdfFile);

      formData.set("price", parseFloat(values.price));
      if (values.ratings) formData.set("ratings", parseFloat(values.ratings));

      const response = await axios.post(`${API_URL}/api/v1/add-book`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      setAlertMessage("Book added successfully");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/admin/books");
      }, 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to add book");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isLoggedIn && role === "admin" && (
        <div className="flex flex-col gap-1 text-xl">
          <h2 className="text-3xl mb-10 font-semibold">Add New Book</h2>
          <label className="text-xl">URL:</label>
          <input type="text" name="url" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" value={values.url} onChange={change} />
          <label className="text-xl">Title:</label>
          <input type="text" name="title" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" value={values.title} onChange={change} required />
          <label className="text-xl">Author:</label>
          <input type="text" name="author" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" value={values.author} onChange={change} required />
          <label className="text-xl">Subject:</label>
          <input type="text" name="subject" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" value={values.subject} onChange={change} />
          <label className="text-xl">Genre:</label>
          <input type="text" name="genre" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" value={values.genre} onChange={change} />
          <label className="text-xl">Description:</label>
          <textarea name="desc" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" value={values.desc} onChange={change} />
          <label className="text-xl">Price:</label>
          <input type="number" name="price" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" value={values.price} onChange={change} required />
          <label className="text-xl">Language:</label>
          <input type="text" name="language" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" value={values.language} onChange={change} />
          <label className="text-xl">Image URL:</label>
          <input type="text" name="image" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" value={values.image} onChange={change} />
          <label className="text-xl">Ratings:</label>
          <input type="number" name="ratings" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" value={values.ratings} onChange={change} />
          <label className="text-xl">PDF:</label>
          <input type="file" accept="application/pdf" className="border-1 border-[#91aeb2] bg-[#91aeb2] rounded" onChange={handleFileChange} required />
          <div className="flex justify-center">
            <button
              className="bg-[#edb953] border-1 border-[#edb953] rounded-full h-12 text-xl mt-10 w-[11%]"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default AddBook;