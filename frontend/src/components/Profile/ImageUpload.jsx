import React, { useState } from "react";

const ImageUpload = ({ onImageSelect }) => {
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) { // 10MB limit (10 * 1024 KB * 1024 bytes)
        alert("Image size exceeds 10MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 whitespace-nowrap">
        <label className="font-semibold text-[#333]">Profile Image (Max: 30MB):</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:border-2 file:border-[#91aeb2] file:rounded-lg file:bg-[#91aeb2] file:px-4 file:py-2 file:text-sm file:cursor-pointer"
        />
      </div>
      {imagePreview && (
        <div className="w-16 h-16">
          <img
            src={imagePreview}
            alt="Profile Preview"
            className="w-full h-full rounded-full border-2 border-gray-300 object-cover shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;