import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Eye, RefreshCw, Trash2 } from "lucide-react";
import { backend, getimagesrc } from "../../ultis/constant";

const API = `${backend}/api`;
const socketUrl = backend;

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false)

  const socketRef = useRef(null);

  useEffect(() => {
    fetchOrders();
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on("order_created", order => {
      setOrders(prev => [order, ...prev]);
    });

    socket.on("order_status_updated", ({ orderId, order }) => {
      setOrders(prev => prev.map(o => o.orderId === orderId ? order : o));
    });

    socket.on("connect_error", (err) => {
      console.log("sockect connection error:", err.message)
    })
    return () => socket.disconnect();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/order/orderlist`);
      setOrders(res.data.data);
    } catch (err) {
      console.error("FetchOrders", err)
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (order) => {
    setSelected(order);
    setShowModal(true)
  }
  const deletealleorder = async () => {
    if (!window.confirm("Are you sure want to delete all Orders")) return
    try {
      const res = await axios.delete(`${backend}/api/order/deleteorder`)
      setOrders(res.data.data)

    } catch (err) {
      console.log("something wentt wrong")
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Packing": return "bg-blue-100 text-blue-700";
      case "Shipped": return "bg-orange-100 text-orange-700";
      case "Delivered": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const deletesingleorder = async (userId, orderId) => {
    if (!confirm("Delete this order?")) return;

    try {
      const res = await axios.delete(`${API}/order/deletesingleorder/${userId}/${orderId}`);

      if (res.data.success) {
        // Remove deleted order from UI'
        const remainingorders = res.data.data;
        setOrders(remainingorders)
        if (selected?.orderId === orderId) {
          setShowModal(false)
          setSelected(null)
        }
        //setOrders(prev => prev.filter(order => order.orderId !== orderId));
        alert("Order deleted successfully");
      } else {
        alert("Failed to delete order");
      }

    } catch (err) {
      console.error("Delete order error:", err);
      alert("Server error while deleting order");
    }
  };
  const updateStatus = async (orderId, newstatus) => {
    setStatusUpdating(true);
    try {
      const res = await axios.put(`${API}/order/updatestatus/${orderId}`, { status: newstatus })
      const updated = res.data.data;
      if (updated) {
        setOrders(prev => prev.map(o => (o.orderId === updated.orderId ? updated : o)));
        if (selected?.orderId === updated.orderId) {
          setSelected(updated);
        }
      }
      alert("Status updated");
      alert("If you not see the Cutomer name Please click the refresh button")
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setStatusUpdating(false);
    }
  };

  const statusOptions = ["Active", "Packing", "Shipped", "Delivered", "Cancelled", "Pending"];

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500">Live order updates</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-7 gap-4">
          <button onClick={deletealleorder} className="bg-gray-300 px-3 py-2 rounded-md hover:bg-gray-500 cursor-pointer">
            Delete a Entire OrderList
          </button>
          <button onClick={fetchOrders}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            <RefreshCw className={loading ? "animate-spin duration-500" : ""} size={16} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>


        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-center">No orders found</p>
        ) : (
          orders.map(o => (
            <div
              key={o.orderId}
              className="bg-white shadow rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{o.orderId}</p>
                <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(o.ordersummary?.status)}`}>
                  {o.ordersummary?.status}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                Customer: <span className="text-red-500">{o.userId?.first}</span>
              </p>

              <p className="text-sm">Items: {o.products?.length}</p>

              <p className="font-semibold">
                ₹{o.ordersummary?.totalprice?.toLocaleString("en-IN")}
              </p>

              <p className="text-xs text-gray-500">
                {new Date(o.createdAt).toLocaleString("en-IN")}
              </p>

              <div className="flex justify-end gap-4 pt-2">
                <button
                  onClick={() => openDetails(o)}
                  className="text-blue-600 flex items-center gap-1"
                >
                  <Eye size={16} /> View
                </button>
                <button className="text-red-600 flex items-center gap-1" onClick={() => deletesingleorder(o.userId?._id, o.orderId)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>

            </tr>
          </thead>

          <tbody className="divide-y">
            {orders.map(o => (
              <tr key={o.orderId}>
                <td className="px-6 py-4">{o.orderId}</td>
                <td className="px-6 py-4 text-red-500">{o.userId?.first}</td>
                <td className="px-6 py-4">{o.products?.length}</td>
                <td className="px-6 py-4 font-semibold">
                  ₹{o.ordersummary?.totalprice?.toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full ${getStatusColor(o.ordersummary?.status)}`}>
                    {o.ordersummary?.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => { setSelected(o); setShowModal(true); }}
                    className="text-blue-600 flex items-center gap-1"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button onClick={() => deletesingleorder(o.userId?._id, o.orderId)} className="text-red-600 hover:text-red-800 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => { setShowModal(false); setSelected(null); }}
          />

          <div className="relative bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-5">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center justify-between">
              <div>
                <h2 className="text-lg font-bold mb-4">
                  Order {selected.orderId}
                </h2>
                <p className="text-sm text-gray-500">Placed: {new Date(selected.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center">
                  <select
                    value={selected.ordersummary?.status}
                    onChange={(e) => updateStatus(selected.orderId, e.target.value)}
                    disabled={statusUpdating}
                    className={`border rounded-md px-3 py-2`}
                  >
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => { setShowModal(false); setSelected(null) }}
                    className="mt-6 px-4 py-2 bg-gray-100 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CUSTOMER */}
              <div>
                <h3 className="font-semibold mb-2">Customer</h3>
                <div className="bg-gray-100 p-4 rounded space-y-1 text-sm">
                  <p><span className="text-orange-500">First: </span>{selected.userId?.first}</p>
                  <p><span className="text-orange-500">Address:</span> {selected.ordersummary?.address}</p>
                  <p><span className="text-orange-500">Email:</span> {selected.userId?.email}</p>
                  <p><span className="text-orange-500">Phone:</span> {selected.userId?.phone}</p>
                </div>

              </div>
              <div><h3 className="font-semibold mt-4">Summary</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md space-y-2 text-sm">
                  <div className="flex justify-between"><span>Items</span><span>{selected.products.length}</span></div>
                  <div className="flex justify-between"><span>Subtotal</span><span>₹{selected.ordersummary?.subtotal?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>₹{selected.ordersummary?.tax?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-semibold"><span>Total</span><span>₹{selected.ordersummary?.totalprice?.toLocaleString('en-IN')}</span></div>
                </div></div>
              {/* PRODUCTS */}
              <div>
                <h3 className="font-semibold mb-2">Products</h3>
                <div className="space-y-3">
                  {selected.products.map(p => (
                    <div key={p.productId} className="flex gap-3 border p-3 rounded">
                      <img
                        src={getimagesrc(p.imageurl)}
                        className="w-14 h-14 object-cover rounded"
                        alt=""
                      />
                      <div className="flex-1">
                        <p className="font-medium">{p.productname}</p>
                        <p className="text-sm text-gray-500">Qty: {p.quantity}</p>
                      </div>
                      <p className="font-semibold">
                        ₹{p.price * p.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersContent;
