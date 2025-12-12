import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const admin= JSON.parse(localStorage.getItem("auth_user"));

  if (!admin) return <Navigate to="/auth/login" />;
  if (admin.role !== "admin") return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
