import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "https://bookmosaic.onrender.com";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { book } = state || {};
  const userId = localStorage.getItem("id");
  const securePdfUrl = `${API_URL}${book?.pdf}`;
  console.log(securePdfUrl);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!book || !userId) {
      console.error("Missing book or user ID, redirecting to login");
      navigate("/login");
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const handlePurchase = async () => {
      try {
        const purchaseData = {
          user: userId,
          book: book._id,
          paymentMethod: "Online",
        };
        await axios.post(`${API_URL}/api/v1/add-purchase`, purchaseData);
        console.log("Purchase recorded successfully");

        const notificationData = {
          userId,
          book: book._id,
          title: book.title || "Untitled",
          image: book.image || "",
          author: book.author || "Unknown",
          price: Number(book.price) || 0,
          description: "Purchase Successful!",
        };
        await axios.post(`${API_URL}/api/v1/add-notification`, notificationData);
        console.log("Notification stored successfully");

        if (Notification.permission === "granted") {
          new Notification("Payment Successful! 🎉", {
            body: `Your book "${book?.title}" is ready for download.`,
            icon: book?.image || "/default-book.png",
          });
        }
      } catch (err) {
        console.error("Error in payment success:", err.response?.data || err.message);
      }
    };

    handlePurchase();
  }, [navigate, book, userId]);

  return (
    <div className="relative pt-[191px] overflow-x-hidden text-center p-10 mb-20">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful! ✅</h1>
      <p>Here is your book. Happy reading! 📖📔</p>
      <a
        href={securePdfUrl}
        download
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Download Your PDF 📥
      </a>
    </div>
  );
};

export default PaymentSuccess;