// components/auth/AuthRedirect.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('auth_user') || 'null');
    const token = localStorage.getItem('auth_token');
    
    if (token && user) {
      // User is logged in, redirect based on role
      if (user.role === 'admin') {
        navigate('/adminpage', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else {
      // User is not logged in, redirect to login
      navigate('/auth/login', { replace: true });
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    </div>
  );
};

export default AuthRedirect;