import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AnalogClock from "../Fun-components/AnalogClock";
import MotivationalQuote from "../Fun-components/MotivationalQuote";
import AdminNotes from "../Fun-components/AdminNotes";

const API_URL = "https://bookmosaic.onrender.com";

export default function Dashboard() {
  const location = useLocation();
  const isBasePath = location.pathname === "/admin/dashboard";

  return (
    <div className="relative pt-[121px] overflow-x-hidden p-6">
      <div className="flex w-full p-4 h-auto bg-gray-100 shadow-lg rounded-xl gap-4">
        {/* Sidebar */}
        <div className="w-3/12 flex flex-col bg-[#e2e3e4] p-4 rounded-l-xl items-center">
          <h1 className="text-[40px] font-semibold mb-6 text-center">Admin Dashboard</h1>
          <ul className="w-60 space-y-4 pt-10 pb-24 text-[20px]">
            {[
              { name: "Daily Stats", path: "/admin/dashboard/daily-stats" },
              { name: "User Activities", path: "/admin/dashboard/user-activity" },
              { name: "Book Analytics", path: "/admin/dashboard/book-analytics" },
              { name: "Monthly Stats", path: "/admin/dashboard/monthly-analytics" },
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

        {/* Main Content */}
        <div className="w-9/12 bg-white p-6 shadow-lg rounded-r-xl overflow-y-auto">
          {isBasePath ? (
            <div className="relative p-3 bg-gray-100">
              <AnalogClock />
              <MotivationalQuote />
              <AdminNotes />
              <div className="mb-6"></div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}