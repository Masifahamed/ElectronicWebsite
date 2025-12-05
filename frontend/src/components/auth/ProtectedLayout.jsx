// components/auth/ProtectedLayout.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../user/Navbar';
import Footer from '../user/Footer';

const ProtectedLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('authToken');
  
  // Redirect to login if not authenticated
  if (!token || !user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // If admin tries to access user routes, redirect to admin panel
  if (user.role === 'admin') {
    return <Navigate to="/adminpage" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;