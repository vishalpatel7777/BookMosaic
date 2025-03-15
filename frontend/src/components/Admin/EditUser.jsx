import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomAlert from "../Alert/CustomAlert";

const API_URL = "http://localhost:1000";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/v1/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/v1/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
      setAlertMessage("User deleted successfully");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to delete user");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  return (
    <div className="relative pt-[121px] overflow-x-hidden p-6">
      <h2 className="text-3xl font-bold mb-9">Manage Users</h2>
      {loading && (
        <div className="flex items-center justify-center">
          <p>Loading...</p>
        </div>
      )}
      {!loading && (
        <table className="min-w-full border-collapse border border-gray-300 text-xl mb-10">
          <thead>
            <tr className="bg-[#91aeb2]">
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Age</th>
              <th className="border p-2">Verification</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.fullname}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">{user.age}</td>
                <td className="border p-2">{user.isVerified ? "Verified" : "Not Verified"}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-[#c15c54] text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default ManageUsers;