// components/DebugAuth.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugAuth = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading auth...</div>;

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded text-xs z-50">
      <div>Auth Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div>User: {user ? JSON.stringify(user) : 'None'}</div>
      <div>Token: {localStorage.getItem('authToken') || 'None'}</div>
    </div>
  );
};

export default DebugAuth;