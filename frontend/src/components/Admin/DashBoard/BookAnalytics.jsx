import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:1000";

export default function BookAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookAnalytics = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/book-analytics`);
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching book analytics:", error);
        setError("Failed to load book analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookAnalytics();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!analytics) return <p className="text-center text-gray-500">No analytics data available.</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-[48px] font-semibold mb-4">📚 Book Analytics</h2>
      <p className="text-[32px] font-bold mb-3">Total Books: {analytics.totalBooks}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold text-[24px] mb-2">⭐ Top Rated Books</h3>
          <ul className="text-[20px]">
            {analytics.topRatedBooks.map((book) => (
              <li key={book._id}>{book.title} - {book.ratings}⭐</li>
            ))}
          </ul>
        </div>

        <div className="border p-4 rounded-md">
          <h3 className="font-semibold text-[24px] mb-2">🔥 Most Purchased Books</h3>
          <ul className="text-[20px]">
            {analytics.mostPurchasedBooks.map((book) => (
              <li key={book._id}>{book.title} - {book.purchases} Sales</li>
            ))}
          </ul>
        </div>

        <div className="border p-4 rounded-md col-span-2">
          <h3 className="font-semibold text-[24px] mb-2">📅 Recently Added Books</h3>
          <ul className="text-[20px]">
            {analytics.recentBooks.map((book) => (
              <li key={book._id}>{book.title} - Added on {new Date(book.createdAt).toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}