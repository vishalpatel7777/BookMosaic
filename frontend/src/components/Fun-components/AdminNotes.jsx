import { useState, useEffect } from "react";

const AdminNotes = () => {
  const [note, setNote] = useState(localStorage.getItem("adminNote") || "");

  useEffect(() => {
    localStorage.setItem("adminNote", note);
  }, [note]);

  return (
    <div className="bg-yellow-200 p-4 rounded-xl shadow-lg w-full max-w-md mx-auto mt-6">
      <h3 className="text-lg font-bold text-gray-800">📌 Quick Notes</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your notes here..."
        className="w-full p-2 mt-2 border-none rounded-md bg-yellow-100 text-gray-800 resize-none focus:outline-none"
        rows="4"
      ></textarea>
    </div>
  );
};

export default AdminNotes;
