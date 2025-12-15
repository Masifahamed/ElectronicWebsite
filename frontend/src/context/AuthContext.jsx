// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  //const isAuthenticated=!!user

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated:!!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// // src/context/AuthContext.js - UPDATED WITH SEPARATE STORAGE
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [userType, setUserType] = useState(null); // 'admin' or 'user'
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Separate storage keys for admin and user
//   const getStorageKey = (type, key) => {
//     return type ? `${type}_${key}` : key;
//   };

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = () => {
//     try {
//       // Check for admin auth first
//       const adminToken = localStorage.getItem('admin_authToken');
//       const adminUser = localStorage.getItem('admin_user');
      
//       if (adminToken && adminUser) {
//         const parsedUser = JSON.parse(adminUser);
//         setIsAuthenticated(true);
//         setUser(parsedUser);
//         setUserType('admin');
//         console.log('Admin authenticated:', parsedUser);
//         return;
//       }

//       // Check for user auth
//       const userToken = localStorage.getItem('user_authToken');
//       const userData = localStorage.getItem('user_user');
      
//       if (userToken && userData) {
//         const parsedUser = JSON.parse(userData);
//         setIsAuthenticated(true);
//         setUser(parsedUser);
//         setUserType('user');
//         console.log('User authenticated:', parsedUser);
//         return;
//       }

//       // No authentication found
//       setIsAuthenticated(false);
//       setUser(null);
//       setUserType(null);
//     } catch (error) {
//       console.error('Error checking auth status:', error);
//       clearAllAuth();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password, type = 'user') => {
//     try {
//       console.log('Login attempt:', { email, type });
      
//       let userData = null;
//       let token = null;

//       // Admin authentication
//       if (type === 'admin') {
//         if (email === 'admin@example.com' && password === 'admin123') {
//           userData = {
//             id: 1,
//             email: email,
//             name: 'Admin User',
//             role: 'admin',
//             type: 'admin'
//           };
//           token = 'admin-token-' + Date.now();
//         } else {
//           throw new Error('Invalid admin credentials');
//         }
//       } 
//       // User authentication
//       else {
//         if (email === 'user@example.com' && password === 'user123') {
//           userData = {
//             id: 2,
//             email: email,
//             name: 'Regular User',
//             role: 'user',
//             type: 'user'
//           };
//           token = 'user-token-' + Date.now();
//         } else {
//           throw new Error('Invalid user credentials');
//         }
//       }

//       // Clear any existing auth first
//       clearAllAuth();

//       // Store in separate localStorage keys based on type
//       if (type === 'admin') {
//         localStorage.setItem('admin_authToken', token);
//         localStorage.setItem('admin_user', JSON.stringify(userData));
//       } else {
//         localStorage.setItem('user_authToken', token);
//         localStorage.setItem('user_user', JSON.stringify(userData));
//       }
      
//       // Update state
//       setIsAuthenticated(true);
//       setUser(userData);
//       setUserType(type);
      
//       console.log('Login successful:', userData);

//       // Redirect based on type
//       if (type === 'admin') {
//         navigate('/adminpage', { replace: true });
//       } else {
//         navigate('/', { replace: true });
//       }

//       return { success: true, user: userData };
//     } catch (error) {
//       console.error('Login error:', error);
//       return { success: false, error: error.message };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const token = 'user-token-' + Date.now();
      
//       // Clear any existing auth
//       clearAllAuth();
      
//       // Store as user (registration is only for users, not admins)
//       localStorage.setItem('user_authToken', token);
//       localStorage.setItem('user_user', JSON.stringify(userData));
      
//       setIsAuthenticated(true);
//       setUser(userData);
//       setUserType('user');
      
//       navigate('/', { replace: true });
      
//       return { success: true, user: userData };
//     } catch (error) {
//       console.error('Registration error:', error);
//       return { success: false, error: error.message };
//     }
//   };

//   const logout = () => {
//     clearAllAuth();
//     setIsAuthenticated(false);
//     setUser(null);
//     setUserType(null);
//     navigate('/auth/login', { replace: true });
//   };

//   const clearAllAuth = () => {
//     // Clear both admin and user auth data
//     localStorage.removeItem('admin_authToken');
//     localStorage.removeItem('admin_user');
//     localStorage.removeItem('user_authToken');
//     localStorage.removeItem('user_user');
//   };

//   const getCurrentUser = () => {
//     return user;
//   };

//   const isAdmin = () => {
//     return userType === 'admin';
//   };

//   const isUser = () => {
//     return userType === 'user';
//   };

//   const value = {
//     isAuthenticated,
//     user,
//     userType,
//     loading,
//     login,
//     register,
//     logout,
//     checkAuthStatus,
//     getCurrentUser,
//     isAdmin,
//     isUser
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };