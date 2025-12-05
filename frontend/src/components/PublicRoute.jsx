// components/PublicRoute.js
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  let user = null;
  
  try {
    const userData = localStorage.getItem('user');
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  console.log('PublicRoute Check - Token:', token);
  console.log('PublicRoute Check - User:', user);

  if (token && user && user.id) {
    console.log('User is authenticated, redirecting...');
    if (user.role === 'admin') {
      return <Navigate to="/adminpage" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;