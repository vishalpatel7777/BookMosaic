import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://bookmosaic.onrender.com";

export default function DailyStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/daily`);
        setStats(response.data);
      } catch (err) {
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full bg-white p-6 shadow-lg rounded-xl overflow-y-auto">
      <h2 className="text-[34px] font-bold mb-6">📊 Daily Statistics</h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg shadow-md">
            <h3 className="text-[24px] font-semibold text-blue-800">Total Users</h3>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow-md">
            <h3 className="text-[24px] font-semibold text-green-800">Active Users (24h)</h3>
            <p className="text-3xl font-bold">{stats.activeUsers}</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
            <h3 className="text-[24px] font-semibold text-yellow-800">Total Book Purchases</h3>
            <p className="text-3xl font-bold">{stats.totalPurchases}</p>
          </div>
          <div className="bg-purple-100 p-6 rounded-lg shadow-md">
            <h3 className="text-[24px] font-semibold text-purple-800">Total Reviews</h3>
            <p className="text-3xl font-bold">{stats.totalReviews}</p>
          </div>
        </div>
      )}
    </div>
  );
}