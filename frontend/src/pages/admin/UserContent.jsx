import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../../ultis/constant";

const UsersContent = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${backend}/api/user/getuser`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${backend}/api/user/deleteuser/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Users Management</h2>
        <p className="text-sm text-gray-500 mt-1">
          Total Users: {users.length}
        </p>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white border rounded-lg shadow p-4 space-y-2"
            >
              <div>
                <p className="font-semibold text-lg">
                  {user.first} {user.last}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <div className="text-sm">
                <p>
                  <span className="font-medium">Phone:</span> {user.phone}
                </p>
                <p>
                  <span className="font-medium">Last Active:</span>{" "}
                  {new Date(user.updatedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="text-red-600 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP / TABLE VIEW ================= */}
      <div className="hidden md:block bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {user.first} {user.last}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">
                    {new Date(user.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersContent;
