// src/hoc/withAuth.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const{token,user}=res.data

      const authentoken = localStorage.getItem('auth_token',token);
      const authenuser = localStorage.getItem('auth_user',user);
      
      if (authentoken && authenuser) {
        setIsAuthenticated(true);
      } else {
        navigate('/');
      }
      setLoading(false);
    }, [navigate]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("auth_user");

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const requireAuth = (callback) => {
    if (!isAuthenticated) return false;
    return callback();
  };

  return { isAuthenticated, user, loading, requireAuth };
};
