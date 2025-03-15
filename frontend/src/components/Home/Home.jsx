import React from "react";
import RecommendedBooks from "../Category/RecommendedBooks";
import HomeBookShelf from "../../assets/home-page/book.png";

import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full min-h-screen overflow-auto flex flex-col overflow-y-hidden ">
        <main className="relative w-full min-h-screen flex flex-col justify-center items-center ">
          <div className="relative px-12 w-full flex justify-between items-center ">
            <div className="max-w-3xl relative left-5 top-8">
              <h1 className="text-[76px] font-medium leading-[1.2] mb-10 ">
                Shop Your
                <br />
                Dream Book.
              </h1>
              <p className="text-[24px] font-light italic text-gray-600 mb-6">
                “A book is more than just pages ,&nbsp;&nbsp; it’s a doorway to
                worlds unknown,
                <br />a whisper of wisdom from the past, &nbsp; and a spark for
                dreams yet to come.” 📖✨
              </p>
              <div
                className="text-[20px] font-medium bg-[#d46a6a] text-black py-2 px-6 rounded-full hover:bg-[#b95353] transition inline-block top-10 relative"
                onClick={() => navigate("/category")}
              >
                Order Now
              </div>
            </div>
            <div className="relative top-60 left-10">
              <img
                src={HomeBookShelf}
                alt="Bookshelf"
                className="max-w-[500px] h-auto"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
