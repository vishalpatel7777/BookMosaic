import React from "react";
import { Link } from "react-router-dom";

const API_URL = "https://bookmosaic.onrender.com";

const Adminhome = () => {
  return (
    <div className="w-full min-h-screen overflow-auto flex flex-col overflow-y-hidden">
      <main className="relative w-full min-h-screen flex flex-col justify-center items-center">
        <div className="relative px-12 w-full flex justify-between items-center">
          <div className="max-w-3xl relative left-5 top-8">
            <h1 className="text-[76px] font-medium leading-[1.2] mb-10">
              Welcome Back, Chief!  
              <br />
              Let’s manage some books.
            </h1>
            <p className="text-[24px] font-light italic text-gray-600 mb-6">
              “Hey Boss, hope you're doing great! Wishing you an amazing day as always ✨
              <br />
              Let's make BookMosaic even better! 🎉💫"
            </p>
            <button className="text-[23px] font-medium bg-[#d46a6a] text-black py-2 px-6 rounded-full hover:bg-[#b95353] transition inline-block top-10 relative">
              <Link to="/admin/dashboard">Let’s Do This! 🚀</Link>
            </button>
          </div>
          <div className="relative top-6 right-40">
            <img
              src="../../src/assets/admin/home-page.png"
              alt="Bookshelf"
              className="max-w-[500px] h-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Adminhome;