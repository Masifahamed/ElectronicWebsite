import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Home, List, LogOut, Menu, ShoppingBag, User, X } from "lucide-react";
import logo from '../../assets/logo.png'
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const headerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status and get user data
  const checkAuth = () => {
    //backend response
 const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(true);
        // Extract first name from user data
        if (user.name) {
          const firstName = user.name.split(' ')[0]; // Get first name only
          setUserName(firstName);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]); // Use email username as fallback
        } else {
          setUserName("User");
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
        setUserName("");
      }
    } else {
      setIsAuthenticated(false);
      setUserName("");
    }
  };

  // Check authentication status on component mount and route changes
  useEffect(() => {
    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Check auth when location changes
  useEffect(() => {
    checkAuth();
  }, [location]);

  // Show popup on scroll for non-authenticated users
  useEffect(() => {
    if (isAuthenticated) return;

    const handleScroll = () => {
      stickyHeader();
      // Show auth popup when user scrolls down 300px
      if (window.scrollY > 300 && !showAuthPopup) {
        setShowAuthPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, showAuthPopup]);

  // Common Classes for consistent styling
  const navlinkclasses = (isActive) => 
    `hover:text-blue-400 transition cursor-pointer py-2 ${
      isActive ? 'text-blue-400' : 'text-gray-500'
    }`;

  // Mobile navlink classes
  const mobilenavlink = (isActive) => 
    `hover:text-blue-400 transition cursor-pointer py-2 ${
      isActive ? 'text-blue-400' : 'text-gray-500'
    }`;

  // Navigation items with their routes
  const navItems = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5" />,requiresAuth:true},
    { name: "Order", path: "/orders", icon: <List className="h-5 w-5" />,requiresAuth:true},
    { name: "Wishlist", path: "/wishlist", icon: <Heart className="h-5 w-5" />,requiresAuth:true},
    { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" />,requiresAuth:true},
    { name: "Product", path: "/product", icon: <ShoppingBag className="h-5 w-5" />,requiresAuth:true}
  ];

  // Sticky Function
  const stickyHeader = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      headerRef.current?.classList.add('sticky-header');
    } else {
      headerRef.current?.classList.remove('sticky-header');
    }
  };

  // Handle navigation with auth check
  const handleNavigation = (path, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      setShowAuthPopup(true);
      setIsOpen(false);
      return;
    }
    navigate(path); 
    setIsOpen(false);
  };

  // Auth functions
  const handleLogin = () => {
    navigate('/auth/login');
    setShowAuthPopup(false);
  };

  const handleRegister = () => {
    navigate('/auth/register');
    setShowAuthPopup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setIsAuthenticated(false);
    setUserName("");
    setShowAuthPopup(false);
    navigate('/auth/login');
    window.dispatchEvent(new Event('storage')); // Notify other tabs
  };

  // Event listener setup and cleanup
  useEffect(() => {
    const handleScroll = () => stickyHeader();
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup Function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav
        className="bg-white text-gray-500 shadow-md py-4 flex justify-between items-center relative z-20 px-6 lg:px-20"
        ref={headerRef}
      >
        {/* Logo */}
        <div className="bg-transparent rounded-full flex">
          <img
            src={logo}
            alt="logo of electronic"
            className="w-25 h-25 object-cover"
            //onClick={() => handleNavigation("/")}
          />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-8 font-medium items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.name}
                className={`${navlinkclasses(isActive)} flex gap-1 items-center text-md`}
                onClick={() => handleNavigation(item.path, item.requiresAuth)}
              >
                {item.icon}
                {item.name}
              </li>
            );
          })}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* User Welcome Message */}
              <li className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  Welcome, <span className="text-blue-600">{userName}</span>
                </span>
              </li>
              {/* Logout Button */}
              <li
                className="cursor-pointer py-2 flex text-sm gap-1 items-center justify-center text-gray-500 hover:text-red-400 transition border border-gray-300 rounded-full px-4 py-2 hover:border-red-300"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </li>
            </div>
          ) : (
            <>
              <li
                className="hover:text-blue-400 transition cursor-pointer py-2 text-gray-500"
                onClick={() => handleNavigation('/auth/login')}
              >
                Login
              </li>
              <li
                className="transition cursor-pointer bg-gradient-to-r from-[#1600A0] to-[#9B77E7] px-4 py-2 rounded-full text-white hover:opacity-90"
                onClick={() => handleNavigation('/auth/register')}
              >
                Register
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden focus:outline-none transition cursor-pointer"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-white lg:hidden z-50 shadow-lg"
            >
              <ul className="flex flex-col items-center py-6 space-y-4 bg-white z-50 text-lg font-medium">
                {/* User Welcome in Mobile */}
                {isAuthenticated && (
                  <li className="flex items-center gap-2 text-gray-700 mb-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <User className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      Welcome, <span className="text-blue-600">{userName}</span>
                    </span>
                  </li>
                )}
                
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li
                      key={item.name}
                      className={`${mobilenavlink(isActive)} flex gap-2 items-center`}
                      onClick={() => handleNavigation(item.path, item.requiresAuth)}
                    >
                      {item.icon}
                      {item.name}
                    </li>
                  );
                })}
                {isAuthenticated ? (
                  <li
                    className="hover:text-red-400 transition cursor-pointer py-2 text-gray-500 flex gap-2 items-center border border-gray-300 rounded-full px-4 py-2 hover:border-red-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </li>
                ) : (
                  <>
                    <li
                      className="hover:text-blue-400 transition cursor-pointer py-2 text-gray-500"
                      onClick={() => handleNavigation('/auth/login')}
                    >
                      Login
                    </li>
                    <li
                      className="transition cursor-pointer bg-gradient-to-r from-[#1600A0] to-[#9B77E7] px-4 py-2 text-white rounded-full"
                      onClick={() => handleNavigation('/auth/register')}
                    >
                      Register
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Authentication Popup */}
      <AnimatePresence>
        {showAuthPopup && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuthPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white relative rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <X 
                className="absolute top-3 right-3 cursor-pointer h-5 w-5" 
                onClick={() => setShowAuthPopup(false)}
              />
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Authentication Required
              </h3>
              <p className="text-gray-600 mb-6">
                Please login or register to access this feature and view product details.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLogin}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                >
                  Register
                </button>
                <button
                  onClick={() => setShowAuthPopup(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
