// pages/OrderTracking.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Truck,
  Package,
  CheckCircle,
  MapPin,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink, X
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import { backend } from "../../ultis/constant";

const SOCKET_URL = backend;

const OrderTracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showpopup, setShowpopup] = useState(false)
  const socketRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("auth_user"));
  const userId = user?._id;


  // 1. Load user orders

  const loadOrders = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await axios.get(`${backend}/api/order/${userId}`);
      setRecentOrders(res.data?.data || []);

    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);


  // 2. SOCKET – get real-time status updates

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("join_room", userId);

    socketRef.current.on("order_status_updated", (data) => {
      if (data?.orderId === order?._id) {
        setOrder((prev) => ({
          ...prev,
          ordersummary: {
            ...prev.ordersummary,
            status: data.status
          }
        }));
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId]);


  // 3. Track Order using Order ID

  const trackOrder = async (id) => {
    const orderId = id || trackingId.trim()

    if (!orderId) {
      setError("Please enter Order ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${backend}/api/order/${userId}`);

      const orders = res.data?.data || [];

      const found = orders.find((o) => o._id === trackingId.trim());

      if (!found) {
        setError("Order not found. Check again.");
        setOrder(null);
      } else {
        setOrder(found);
        setShowpopup(true)
        setTrackingId("")
      }
    } catch (error) {
      setError("Unable to track order");
    } finally {
      setLoading(false);
    }
  };


  // Helper Functions

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Packing": return "bg-blue-100 text-blue-700";
      case "Shipped": return "bg-orange-100 text-orange-700";
      case "Delivered": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      //second:"numeric",


    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Enter your <span className="font-bold text-gray-800">Order ID</span> to check status
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD12345)"
              className="flex-1 px-4 py-3 sm:py-3.5 md:py-4 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-sm sm:text-base"
            />
            <button
              onClick={trackOrder}
              disabled={loading}
              className="px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4 bg-blue-600 hover:bg-blue-700 
            text-white rounded-lg flex items-center justify-center gap-2 
            transition-colors disabled:opacity-70 disabled:cursor-not-allowed
            text-sm sm:text-base md:text-lg font-medium"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              Track Order
            </button>
          </div>

          {error && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 
          text-red-700 rounded-lg flex items-start sm:items-center gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-sm sm:text-base">{error}</span>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        {!order && recentOrders.length > 0 && (
          <div className="mt-4 sm:mt-6 md:mt-8 bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5">
              Recent Orders
            </h2>

            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {recentOrders.map((o) => (
                <div
                  key={o._id}
                  onClick={() => {
                    setTrackingId(o._id);
                    //trackOrder(o._id);
                  }}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 
                cursor-pointer transition-colors flex flex-col sm:flex-row sm:justify-between 
                sm:items-center gap-2 sm:gap-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base md:text-lg truncate">
                      Order: {o._id}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                      Placed on {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm 
                font-medium whitespace-nowrap flex-shrink-0 mt-2 sm:mt-0
                ${getStatusColor(o.ordersummary?.status)}`}>
                    {o.ordersummary?.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details Popup */}
        {order && showpopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 sm:mt-6 md:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg 
          overflow-hidden relative"
          >
            {/* Header with Blue Background */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-5 md:p-6 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 wrap-anywhere">
                    Order #{order._id}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg opacity-90">
                    Total: ₹{order.ordersummary?.totalprice?.toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  onClick={() => { setShowpopup(false); setOrder(null) }}
                  className="p-1 sm:p-2 absolute right-2 top-2  hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 
              flex items-center gap-2 text-gray-800">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  Order Items ({order.products.length})
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {order.products.map((p, idx) => (
                    <div key={idx}
                      className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base md:text-lg font-medium truncate">
                          {p.productname}
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Quantity: {p.quantity} × ₹{p.price?.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span className="font-semibold text-sm sm:text-base md:text-lg ml-2 sm:ml-4">
                        ₹{(p.price * p.quantity)?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 
              flex items-center gap-2 text-gray-800">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                  Order Status
                </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 
                rounded-lg text-sm sm:text-base md:text-lg font-medium
                ${getStatusColor(order.ordersummary?.status)}`}>
                    {order.ordersummary?.status}
                  </span>
                  <span className="text-gray-600 text-xs sm:text-sm">
                    Updated: {formatDate(order.updatedAt || order.createdAt)}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 
              flex items-center gap-2 text-gray-800">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  Shipping Details
                </h3>
                <div className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg border border-gray-100">
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="font-medium text-sm sm:text-base">
                      {order.userId?.first} {order.userId?.last}
                    </p>
                    <p className="text-gray-700 text-sm sm:text-base">
                      {order.ordersummary?.address}
                    </p>
                    {order.userId?.phone && (
                      <p className="text-gray-600 text-sm sm:text-base">
                        📱 {order.userId?.phone}
                      </p>
                    )}
                    {order.userId?.email && (
                      <p className="text-gray-600 text-sm sm:text-base">
                        ✉️ {order.userId?.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="pt-3 sm:pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 text-gray-800">
                  Order Summary
                </h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items Total</span>
                      <span>₹{Number(order.ordersummary?.subtotal || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>₹{order.ordersummary?.subtotal * 0.05.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base sm:text-lg md:text-xl pt-2 border-t">
                      <span>Total Amount</span>
                      <span className="text-blue-700">
                        ₹{Number(order.ordersummary?.totalprice || 0).toLocaleString("en-IN") ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
