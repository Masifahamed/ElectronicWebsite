import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { io } from "socket.io-client";

const API = "http://localhost:3500/api";
const SOCKET_URL = "http://localhost:3500"

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
      const res = await axios.get(`${API}/order/${userId}`);
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Active Orders</h1>

      {loading && <p className="text-center py-4">Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-center text-gray-600">No active orders found.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow">

            {/* Summary */}
            <div className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleOrderExpansion(order._id)}
            >
              <div>
                <p className="font-semibold">Order ID: {order.orderId}</p>

                <p className="text-gray-500 text-sm">
                  Date: {formatDate(order.createdAt)}
                </p>

                <p className="text-sm">
                  Status: <span className="font-semibold text-blue-600">
                    {order.ordersummary?.status}
                  </span>
                </p>

                <p className="text-sm">
                  Total: ₹{order.ordersummary?.totalprice}
                </p>
              </div>

              {expandedOrder === order._id ? <ChevronUp /> : <ChevronDown />}
            </div>

            {/* Expand */}
            {expandedOrder === order._id && (
              <div className="mt-4 space-y-4">
                {order.products.map((p, index) => (
                  <div key={index} className="flex items-center gap-4 border-b pb-3">
                    <img
                      src={p.imageurl}
                      alt={p.productname}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{p.productname}</p>
                      <p className="text-gray-600 text-sm">Qty: {p.quantity}</p>
                      <p className="text-gray-700 text-sm">
                        ₹{p.price}
                      </p>
                    </div>
                  </div>
                ))}

                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {order.ordersummary?.address}
                </p>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveOrder;