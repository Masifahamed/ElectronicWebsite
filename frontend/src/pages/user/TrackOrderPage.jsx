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
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-4">Track Your Order</h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your <b>Order ID</b> to check status
        </p>

        {/* ---------------- SEARCH BOX ---------------- */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex gap-4">
            <input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Order ID"
              className="flex-1 px-4 py-3 border rounded-lg"
            />
            <button
              onClick={trackOrder}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Search />}
              Track
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-100 text-red-700 p-3 rounded flex items-center gap-2">
              <AlertCircle /> {error}
            </div>
          )}
        </div>

        {/* ---------------- RECENT ORDERS ---------------- */}
        {!order && recentOrders.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold mb-4">Recent Orders</h2>

            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div
                  key={o._id}
                  onClick={() => {
                    setTrackingId(o._id);
                    //trackOrder(o._id);
                  }}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between"
                >
                  <div>
                    <p className="font-medium">Order ID: {o._id}</p>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full flex justify-center items-center text-sm ${getStatusColor(o.ordersummary?.status)}`}>
                    {o.ordersummary?.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- ORDER DETAILS ---------------- */}
        {order && showpopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-xl relative shadow overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-2xl font-bold">Order {order._id}</h2>
              <p>Total: ₹{order.ordersummary?.totalprice}</p>
            </div>
            <X className="absolute top-3 right-3 cursor-pointer" size={30} onClick={() => { setShowpopup(false); setOrder(null) }
            } />
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Package /> Order Items
              </h3>

              {order.products.map((p, idx) => (
                <div key={idx} className="flex justify-between border-b py-3">
                  <span>{p.productname} × {p.quantity}</span>
                  <span>₹{p.price * p.quantity}</span>
                </div>
              ))}

              <h3 className="font-semibold text-lg mt-6 mb-3 flex items-center gap-2">
                <Truck /> Status
              </h3>

              <span className={`px-4 py-2 rounded-lg text-lg ${getStatusColor(order.ordersummary?.status)}`}>
                {order.ordersummary?.status}
              </span>

              <h3 className="font-semibold text-lg mt-6 mb-3 flex items-center gap-2">
                <MapPin /> Shipping Address
              </h3>

              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">{order.userId?.first} {order.userId?.last}</p>
                <p>{order.ordersummary?.address}</p>
                <p>{order.userId?.phone}</p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default OrderTracking;
