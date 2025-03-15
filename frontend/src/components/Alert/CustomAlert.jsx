import React from "react";

const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50   bg-opacity-100">
      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <p className="font-semibold text-white text-xl mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#2e86a7] text-white rounded hover:bg-[#22609b] transition duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;