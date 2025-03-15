import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomAlert from "../Alert/CustomAlert";

const API_URL = "https://bookmosaic.onrender.com"; // Hardcoded for now


const Notification = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchNotifications();
  }, [userId, navigate]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/v1/get-notifications/${userId}`);
      setNotifications(res.data);

      const ratingsData = await Promise.all(
        res.data.map(async (notif) => {
          const ratingRes = await axios.get(`${API_URL}/api/v1/get-rating/${userId}/${notif.book}`);
          return { bookId: notif.book, rate: ratingRes.data?.rate };
        })
      );
      const ratingsMap = ratingsData.reduce((acc, { bookId, rate }) => {
        if (rate !== undefined) acc[bookId] = rate;
        return acc;
      }, {});
      setRatings(ratingsMap);

      const reviewsData = await Promise.all(
        res.data.map(async (notif) => {
          const reviewRes = await axios.get(`${API_URL}/api/v1/get-review/${userId}/${notif.book}`);
          return { bookId: notif.book, review: reviewRes.data?.review };
        })
      );
      const submittedReviewsMap = reviewsData.reduce((acc, { bookId, review }) => {
        if (review) acc[bookId] = review;
        return acc;
      }, {});
      setSubmittedReviews(submittedReviewsMap);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await axios.delete(`${API_URL}/api/v1/delete-notification/${notificationId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification. Please try again.");
    }
  };

  const handleRating = async (bookId, rating) => {
    if (!bookId) {
      setError("Book ID is missing. Cannot submit rating.");
      return;
    }
    if (ratings[bookId] !== undefined) {
      setError("You have already rated this book.");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/v1/store-rating`, { book: bookId, rate: rating, user: userId });
      setRatings((prev) => ({ ...prev, [bookId]: rating }));
      setAlertMessage("Rating submitted successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (err) {
      console.error("Error submitting rating:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to submit rating. Please try again.");
    }
  };

  const handleReview = async (bookId, notificationId) => {
    const reviewText = (reviews[notificationId] || "").trim();
    if (!reviewText) {
      setError("Review cannot be empty.");
      return;
    }
    if (!bookId) {
      setError("Book ID is missing. Cannot submit review.");
      return;
    }
    if (submittedReviews[bookId]) {
      setError("You have already reviewed this book.");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/v1/store-review`, {
        userId,
        bookId,
        rating: ratings[bookId] || 0,
        review: reviewText,
      });
      setReviews((prev) => ({ ...prev, [notificationId]: "" }));
      setSubmittedReviews((prev) => ({ ...prev, [bookId]: reviewText }));
      setAlertMessage("Review submitted successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (err) {
      console.error("Error submitting review:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to submit review. Please try again.");
    }
  };

  const renderStars = (bookId) => {
    const currentRating = ratings[bookId];
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="flex space-x-1">
        {currentRating !== undefined ? (
          <span className="text-yellow-400 text-2xl">{Array(currentRating).fill("★").join("")}{Array(5 - currentRating).fill("☆").join("")}</span>
        ) : (
          stars.map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl ${star <= (ratings[bookId] || 0) ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => handleRating(bookId, star)}
            >
              ★
            </span>
          ))
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-gray-500">Loading notifications...</p></div>;
  }

  return (
    <div className="relative pt-[121px] overflow-x-hidden p-6 flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📢 Your Notifications</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4 w-full max-w-lg">{error}</p>}
      {notifications.length > 0 ? (
        <div className="w-full max-w-2xl space-y-6">
          {notifications.map((notification) => (
            <div key={notification._id} className="bg-white shadow-lg p-6 rounded-lg border border-gray-200 flex flex-col transition hover:shadow-xl">
              <div className="flex items-start space-x-4">
                {notification.image && (
                  <img
                    src={notification.image}
                    alt={notification.title}
                    className="w-24 h-36 object-cover rounded"
                    onError={(e) => (e.target.src = "/default-book.png")}
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">{notification.title}</h2>
                  <p className="text-gray-600">by {notification.author || "Unknown"}</p>
                  <p className="text-gray-600">Price: ₹{notification.price || "N/A"}</p>
                  <p className="text-green-600 mt-1">You purchased this book! 🎉 {notification.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm bg-red-50 px-3 py-1 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium">Rate this book:</p>
                {notification.book ? renderStars(notification.book) : <p className="text-red-500">Book ID missing</p>}
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium">Write a review:</p>
                {submittedReviews[notification.book] ? (
                  <p className="text-gray-600 italic">{submittedReviews[notification.book]}</p>
                ) : (
                  <>
                    <textarea
                      value={reviews[notification._id] || ""}
                      onChange={(e) => setReviews((prev) => ({ ...prev, [notification._id]: e.target.value }))}
                      placeholder="Share your thoughts..."
                      className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      disabled={!notification.book}
                    />
                    <button
                      onClick={() => handleReview(notification.book, notification._id)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      disabled={!notification.book}
                    >
                      Submit Review
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg">No notifications yet.</p>
      )}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default Notification;