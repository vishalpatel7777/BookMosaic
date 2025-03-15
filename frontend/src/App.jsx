import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AdminNavbar from "./components/Admin/AdminNav";
import Footer from "./components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { authActions } from "./store/auth";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    if (role === "admin" && window.location.pathname !== "/admin/home") {
      navigate("/admin/home");
    }
  }, [role, navigate]);

  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const showNavbar = location.pathname !== "/welcome";
  const showFooter = location.pathname !== "/welcome";

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100 text-center p-5">
        <h2 className="text-2xl font-bold text-red-700">
          🚫 Mobile Not Supported! <br />
          Please open this website on a Desktop or Laptop.
        </h2>
      </div>
    );
  }

  return (
    <>
      {showNavbar && (role === "admin" ? <AdminNavbar /> : <Navbar />)}
      <Outlet />
      {showFooter && <Footer />}
    </>
  );
}

export default App;
