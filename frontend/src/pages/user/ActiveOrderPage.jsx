import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { io } from "socket.io-client";
import { backend, getimagesrc } from "../../ultis/constant";
import { ShoppingBag } from "lucide-react";

const SOCKET_URL = backend

const ActiveOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null)
  // Fetch only this user's orders
  const fetchOrders = async () => {
    const user = JSON.parse(localStorage.getItem("auth_user"))
    const userId = user?._id
    try {
      setLoading(true);
      const res = await axios.get(`${backend}/api/order/${userId}`);
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("auth_user"))
    const userId = user?._id;
    if (!userId) {
      alert("please login")
    }
    socketRef.current = io(SOCKET_URL)
    socketRef.current.emit("join_room", userId);
    socketRef.current.on("order_status_updated", (data) => {
      if (!data || !data.orderId) {
        console.log("user not found")
        return
      }
      setOrders((prev) => prev.map((order) => order.orderId === data.orderId ? data.order : order))
    })
    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])



  const toggleOrderExpansion = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };


  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    })
  }
  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-5 lg:p-6">
  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6">
    Active Orders
  </h1>

  {loading && (
    <div className="text-center py-6 sm:py-8">
      <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
      <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600">Loading orders...</p>
    </div>
  )}

  {!loading && orders.length === 0 && (
    <div className="text-center py-8 sm:py-10 md:py-12">
      <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-3 sm:mb-4" />
      <p className="text-gray-600 text-sm sm:text-base md:text-lg">
        No active orders found.
      </p>
    </div>
  )}

  <div className="space-y-3 sm:space-y-4 md:space-y-5">
    {orders.map((order) => (
      <div 
        key={order._id} 
        className="border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl 
          p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
      >

        {/* Summary - Mobile Stacked, Desktop Flex */}
        <div 
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 cursor-pointer"
          onClick={() => toggleOrderExpansion(order._id)}
        >
          <div className="space-y-1.5 sm:space-y-2">
            {/* Order ID */}
            <p className="font-semibold text-sm sm:text-base md:text-lg truncate">
              Order: {order._id || order.orderId}
            </p>

            {/* Mobile Grid for Dates & Status */}
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-xs">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-xs font-semibold text-blue-600">
                  {order.ordersummary?.status}
                </p>
              </div>
            </div>

            {/* Desktop Row for Dates & Status */}
            <div className="hidden sm:flex sm:items-center sm:gap-4 md:gap-6">
              <p className="text-gray-500 text-sm md:text-base">
                {formatDate(order.createdAt)}
              </p>
              
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full
                  ${order.ordersummary?.status === 'Delivered' ? 'bg-green-500' : 
                    order.ordersummary?.status === 'Pending' ? 'bg-yellow-500' : 
                    order.ordersummary?.status === 'Shipped' ? 'bg-blue-500' : 
                    'bg-gray-500'}`}
                />
                <span className="font-semibold text-blue-600 text-sm md:text-base">
                  {order.ordersummary?.status}
                </span>
              </div>
            </div>

            {/* Total Amount */}
            <p className="text-sm sm:text-base md:text-lg font-semibold">
              ₹{order.ordersummary?.totalprice?.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Expand/Collapse Icon */}
          <div className="flex justify-between items-center sm:block">
            <span className="text-xs sm:hidden">View Details</span>
            {expandedOrder === order._id ? 
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : 
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            }
          </div>
        </div>

        {/* Expanded Details */}
        {expandedOrder === order._id && (
          <div className="mt-3 sm:mt-4 md:mt-5 space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-100">
            {/* Products List */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                Products ({order.products.length})
              </h3>
              {order.products.map((p, index) => (
                <div 
                  key={index} 
                  className="flex items-start sm:items-center gap-3 sm:gap-4 p-2 sm:p-3 
                    rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={getimagesrc(p.imageurl)}
                    alt={p.productname}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base md:text-lg truncate">
                      {p.productname}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                      <span className="text-xs sm:text-sm text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                        Qty: {p.quantity}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-700">
                        ₹{p.price?.toLocaleString("en-IN")} each
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-green-600">
                        ₹{(p.price * p.quantity)?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 pt-3 sm:pt-4 border-t border-gray-100">
              {/* Order Summary */}
              <div className="space-y-1.5 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Order Summary</h4>
                <div className="text-xs sm:text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{order.ordersummary?.subtotal?.toLocaleString("en-IN") ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>₹{order.ordersummary?.tax?.toLocaleString("en-IN")?? 0}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1 border-t">
                    <span>Total</span>
                    <span>₹{order.ordersummary?.totalprice?.toLocaleString("en-IN") ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Delivery Address</h4>
                <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg">
                  {order.ordersummary?.address}
                </p>
                <div className="text-xs sm:text-sm">
                  <p className="text-gray-600">
                    Payment: <span className="font-medium text-gray-800">
                      {order.ordersummary?.paymentmethod}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
</div>
  );
};

export default ActiveOrder;