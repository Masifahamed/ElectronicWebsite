import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Save, Edit2, X, Calendar, ShoppingBag, Heart, LogOut, Package, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
//import PopupMessage from "../../components/user/PopupMessage";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
    currentPassword: ""
  });
  const [memberSince, setMemberSince] = useState("");
  const [wishlistStats, setWishlistStats] = useState([]);
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [orderStats, setOrderStats] = useState({

  });
  const navigate = useNavigate();

  const firstNameInputRef = useRef(null);
  const API_BASE_URL = "http://localhost:3500/api/user";

  // Load user data when component mounts
  useEffect(() => {
    loadUserData();
  }, []);

  const user = JSON.parse(localStorage.getItem("auth_user"))
  const userinfo = user._id
  // Auto-focus when editing mode changes
  useEffect(() => {
    if (isEditing && firstNameInputRef.current) {
      setTimeout(() => {
        if (firstNameInputRef.current) {
          firstNameInputRef.current.focus();
          firstNameInputRef.current.select();
        }
      }, 100);
    }
  }, [isEditing]);

  // Get user ID from token or session - FIXED: Better error handling
  const getUserId = () => {
    try {
      const userInfo = localStorage.getItem("auth_user");
      const authToken = localStorage.getItem("auth_token");

      console.log("Auth Token exists:", !!authToken);
      console.log("User Info exists:", !!userInfo);

      if (userInfo) {
        const user = JSON.parse(userInfo);
        console.log("Parsed user info:", user);
        if (user._id) return user._id;
        if (user.id) return user.userId;
        if (user.userId) return user.userId;
        if (user.user && user.user._id) return user.user._id;
        console.log("No user ID found in user info:", user)
      }
      return null;
    } catch (error) {
      console.error("Error parsing user info:", error);
      return null
    }
  };
  //Get auth token
  const getAuthToken = () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error("NO auth token found in localStorage")
        return null
      }
      return token
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null
    }
  }
  const fetchUserData = async () => {
    try {
      const token = getAuthToken();
      const currentUserId = getUserId();

      const response = await fetch(`${API_BASE_URL}/getsingleuser/${currentUserId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load user");
      }

      return result.data; // ALWAYS use `.data`
    } catch (error) {
      console.error("Fetch user error:", error);
      throw error;
    }
  };

  const updateUserData = async (updateData) => {
    try {
      const token = getAuthToken();
      const currentUserId = getUserId();

      const response = await fetch(`${API_BASE_URL}/updateuser/${currentUserId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Update failed");
      }

      return result.data;
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };
  const calculateorder = (orders) => {
    const totals = {
      items: 0,
      subtotal: 0,
      totalprice: 0,
      saving: 0,
      address:""
    }
    orders.forEach(order => {
      totals.items += order.items || 0;
      totals.subtotal += order.subtotal || 0;
      totals.totalprice += order.totalprice;
      totals.saving += order.saving || 0;
      totals.address += order.address||"Address is not provide"
    });
    return totals
  }
  const fetchorder = async (userinfo) => {
    try {

      const res = await axios.get(`http://localhost:3500/api/order/${userinfo}`)
      const orderlist = res.data.data.map((order) => ({
        //orderId: order.orderId,
        items: order.ordersummary?.items,
        subtotal: order.ordersummary?.subtotal,
        totalprice: order.ordersummary?.totalprice,
        saving: order.ordersummary?.saving,
       // products: order.products,
        //date: order.ordersummary?.data,
        //status: order.ordersummary?.status,
        address: order.ordersummary?.address,

      }))
      return orderlist
    } catch (err) {
      console.log("Error in data:", err.message)

      return []
    }
  }

  

  useEffect(() => {
    const loadorder = async () => {
      const data = await fetchorder(userinfo)
      const calculate = calculateorder(data)
      setOrderStats(calculate)
    }
    loadorder()
  }, [])

  // Load user data with profile information - FIXED: Better error handling
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchUserData();

      if (response) {
        // Handle different response structures
        const user = response;

        // console.log("Processing user data:", user);

        if (user) {
          // Set basic user data
          setUserData({

            first: user.first || "",
            last: user.last || "",
            email: user.email || "",
            phone: user.phone || ""
          });

          setUserId(user._id)


          // Set member since date
          const registrationDate = user.createdAt || new Date().toISOString();
          setMemberSince(new Date(registrationDate).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
          }));


          setUserId(user._id);
          // Set order statistics from profile object


          setMemberSince(
            new Date(user.createdAt).toLocaleDateString("en_IN", {
              month: "long",
              year: "numeric",
            })
          )
        }
      } else {
        console.log("No user data received from API");
      }
    } catch (err) {
      console.log("Error loading user data:", err);
      //toast.error("Failed to load profile data. Please login again.");
      //<PopupMessage message={"Failed to load Profile Data.Please login again"} />
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userData.first.trim() || userData.first.length < 2) {
      newErrors.first = "First name is required and must be at least 2 characters";
    }
    if (!userData.last.trim() || userData.last.length < 1) {
      newErrors.last = "Last name is required";
    }
    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!userData.phone || !/^\d{10}$/.test(userData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Profile update password validations 
    if (isEditing) {
      if (userData.newPassword && !userData.currentPassword) {
        newErrors.currentPassword = "Please enter your current password to change password";
      }
      if (userData.newPassword && userData.newPassword.length < 6) {
        newErrors.newPassword = "New password must be at least 6 characters";
      }
      if (userData.newPassword && userData.newPassword !== userData.confirmPassword) {
        newErrors.confirmPassword = "New passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  const wishlistsetup = async () => {
    try {
      //const userId = getUserId()
      const res = await axios.get(`http://localhost:3500/api/wishlist/single/${userinfo}`)
      const formatted = res.data.data.product.map((p) => ({
        ...p,
        rating: p.rating && p.rating <= 5 ? p.rating : Math.floor(Math.random() * 5) + 1,
        views: p.views || Math.floor(Math.random() * 1000) + 10,
        likes: p.likes || Math.floor(Math.random() * 500) + 50,
        reviews: p.reviews || Math.floor(Math.random() * 100) + 1,
        addedDate: p.addedDate,
      }))
      setWishlistStats(formatted)
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    wishlistsetup()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const updateData = {
        first: userData.first,
        last: userData.last,
        email: userData.email,
        phone: userData.phone
      };

      if (userData.newPassword) {
        updateData.currentPassword = userData.currentPassword;
        updateData.newPassword = userData.newPassword;
        updateData.confirmPassword = userData.confirmPassword;
      }

      await updateUserData(updateData);
      toast.success("Profile update successfully")
      setIsEditing(false)
      loadUserData()

    } catch (err) {
      console.error("Error saving user data:", err);
      toast.error(err.message || "Error updating profile. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/auth/login');
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Left Side Profile Header */}
      <div className="bg-gradient-to-b from-blue-700 to-indigo-500 text-white w-80 items-center flex flex-col">
        <div className="flex flex-col items-center mt-10 flex-1 gap-3">
          {/* User Avatar */}
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
            <User className="w-16 h-16" />
          </div>

          {/* User Info */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              {userData.first} {userData.last}
            </h2>
            <p className="text-blue-100 text-lg">{userData.email}</p>
            {userData.phone && (
              <p className="text-blue-100 text-sm mt-1">{userData.phone}</p>
            )}
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={toggleEdit}
            disabled={isLoading}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? (
              <>
                <X className="w-5 h-5" />
                <span>Cancel Edit</span>
              </>
            ) : (
              <>
                <Edit2 className="w-5 h-5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 flex items-center space-x-2 shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>

          {/* Additional Stats from Profile Object */}
          <div className="w-full mt-8 space-y-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Calendar className="w-5 h-5" />
                <p className="text-blue-100">Member since</p>
              </div>
              <p className="text-white font-semibold text-lg">{memberSince}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 py-12 px-6 md:px-12">
        {/* Header - FIXED: Removed isRegistration references */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent mb-3">
            Your Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account information and track your orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{orderStats.items}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>

          </div>

          {/* Pending Orders */}
          < div className="bg-white rounded-2xl shadow-lg p-6" >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-2xl font-bold text-orange-500">{orderStats.subtotal}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Price</p>
                <p className="text-2xl font-bold text-green-500">{orderStats.totalprice}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Saving</p>
                <p className="text-2xl font-bold text-purple-500">₹{orderStats.saving}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

        </div>

        {/* Wishlist Summary */}
        <div className="max-w-6xl mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Wishlist Summary</span>
            </h3>
            <div className="text-xs text-gray-500">
              {wishlistStats.length} {wishlistStats.length === 1 ? "item" : "items"} saved
            </div>
          </div>
          {wishlistStats.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-red-500">{wishlistStats.length}</p>
                <p className="text-sm text-gray-600">Items Saved</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-500">₹{wishlistStats.reduce((total, item) => total + item.price, 0)}</p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
            </div>
          )
          }
        </div>

        {/* Profile Form Card - FIXED: Removed isRegistration references */}
        <div className="max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSave} className="p-8 space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 border-b pb-3">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>First Name</span>
                  </label>
                  <input
                    ref={firstNameInputRef}
                    type="text"
                    name="first"
                    value={userData.first}
                    onChange={handleInputChange}
                    disabled={!isEditing || isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.first ? 'border-red-500' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    autoFocus={isEditing}
                    required
                    minLength={2}
                    placeholder="Enter your first name"
                  />
                  {errors.first && (
                    <p className="text-sm text-red-600">{errors.first}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="last"
                    value={userData.last}
                    onChange={handleInputChange}
                    disabled={!isEditing || isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.last ? 'border-red-500' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    required
                    minLength={1}
                    placeholder="Enter your last name"
                  />
                  {errors.last && (
                    <p className="text-sm text-red-600">{errors.last}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing || isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    required
                    pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing || isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter 10-digit phone number"
                    required
                    pattern="[0-9]{10}"
                    title="Phone number must be exactly 10 digits"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Section - Only show when editing - FIXED: Removed registration logic */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-gray-800 border-b pb-3">
                  Change Password
                </h3>

                {/* Current Password */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Current Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-12 ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-600">{errors.currentPassword}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* New Password */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>New Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={userData.newPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-12 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter new password (min 6 characters)"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Confirm New Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-12 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Confirm new password"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Save Button */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end pt-6"
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-700 to-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div >
  );
};

export default ProfilePage;


