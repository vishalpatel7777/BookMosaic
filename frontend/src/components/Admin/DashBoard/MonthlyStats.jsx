import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const API_URL = "https://bookmosaic.onrender.com";

export default function MonthlyStats() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyAnalytics = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/monthly-analytics`);
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyAnalytics();
  }, []);

  const formatData = (stats) => {
    if (!stats || stats.length === 0) return [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return stats.map((item) => ({
      month: `${months[item._id.month - 1]} ${item._id.year}`,
      count: item.count || item.totalRevenue || 0,
    }));
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const hasData = analytics?.userStats?.length > 0 || analytics?.revenueStats?.length > 0 || analytics?.topGenres?.length > 0;

  return (
    <motion.div
      className="p-6 bg-white shadow-md rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-[34px] font-semibold mb-4">📊 Monthly Analytics</h2>

      {!hasData ? (
        <p className="text-center text-gray-500">📉 No analytics data available yet.</p>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="font-semibold text-[20px]">📈 Users Joined</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatData(analytics?.userStats)}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Users Joined" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-[20px]">💰 Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatData(analytics?.revenueStats)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <motion.div
            className="mt-4 p-4 bg-gray-100 rounded-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold mb-2 text-[20px]">📚 Top Genres Read</h3>
            <ul className="text-[16px]">
              {analytics?.topGenres?.map((genre) => (
                <li key={genre._id}># {genre._id} - {genre.count} books</li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}