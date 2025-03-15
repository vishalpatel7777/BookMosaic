import React from "react";
import Recentlyaddedbook from "./Recentlyaddedbook";
import Filter from "./Filter";
import Allbooks from "./Allbooks";
import RecommendedBooks from "./RecommendedBooks";

function Category() {
  return (
    <>
      <div className="relative min-h-screen  pt-[121px] overflow-x-hidden">
        <Filter />

        <div className="mb-10"></div>

        <RecommendedBooks />
        <div className="mb-10"></div>
        <Recentlyaddedbook />

        <div className="mb-10"></div>
      </div>
    </>
  );
}

export default Category;
