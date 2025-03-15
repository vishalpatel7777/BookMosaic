import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:1000";

export default function UserActivity() {
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/user-activity`);
        setUserActivity(response.data.users || []);
      } catch (error) {
        console.error("Error fetching user activity:", error);
        setUserActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, []); // Removed `userActivity` from dependency array to prevent infinite loop

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">User Activity</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="w-full text-xl font-normal border-collapse border border-gray-200">
          <thead>
            <tr className="bg-[#91aeb2]">
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {userActivity.length > 0 ? (
              userActivity.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border p-2 text-center">No user activity found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}