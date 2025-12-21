// OrdersContent.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Eye, RefreshCw, Trash2} from "lucide-react";
import { backend, getimagesrc } from "../../ultis/constant";

// API base
const API = `${backend}/api`;

const socketUrl = backend;  // same origin as socket server

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchOrders();

    // setup socket
    const socket = io(socketUrl);

    socketRef.current = socket

   

    // listen for events — refresh or update relevant order(s)
    socket.on("order_created", (order) => {
      setOrders(prev => [order, ...prev]);
    });
    socket.on("order_status_updated", ({ orderId, order }) => {
      setOrders(prev => prev.map(o => (o.orderId === orderId ? order : o)));
    });

    socket.on("connect_error", (err) => {
      console.log("Sockect connection error:", err.message)
    })

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/order/orderlist`);
      setOrders(res.data.data);
    } catch (err) {
      console.error("fetchOrders", err);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (order) => {
    setSelected(order);
    setShowModal(true);
  };

  const deletealleorder = async () => {
    if (!window.confirm("Are you sure want to delete all Orders")) return
    try {
      const res = await axios.delete(`${backend}/api/order/deleteorder`)
      setOrders(res.data.data)

    } catch (err) {
      console.log("something wentt wrong")
    }
  }


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
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setStatusUpdating(false);
    }
  };

  const statusOptions = ["Active", "Packing", "Shipped", "Delivered", "Cancelled", "Pending"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500">Admin order management — live updates</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
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

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="7" className="p-6 text-center">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="7" className="p-6 text-center">No orders yet</td></tr>
            ) : (
              orders.map((o) => {
                const total = o.ordersummary?.totalprice || 0;
                return (
                  <tr key={o.orderId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{o.orderId}</div>
                      <div className="text-xs text-gray-500">{String(o._id).slice(-6)}</div>
                    </td>
                    <td className="text-red-500 px-6 py-4">{o.userId?.first}</td>
                    <td className="px-6 py-4">{o.products?.length || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold">₹{total.toLocaleString('en-IN')}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`p-2 rounded-full text-lg ${getStatusColor(o.ordersummary?.status)}`}>
                        {o.ordersummary?.status || "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(o.createdAt).toLocaleString('en-IN')}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                      <button onClick={() => openDetails(o)} className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> View
                      </button>

                      <button onClick={() => deletesingleorder(o.userId?._id, o.orderId)} className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}

          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex-col sm:flex-row sm:gap-5 items-center justify-center pt-20 px-4 ">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => { setShowModal(false); setSelected(null); }} />

          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-auto max-h-[80vh] p-6 z-50">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">Order {selected.orderId}</h2>
                <p className="text-sm text-gray-500">Placed: {new Date(selected.createdAt).toLocaleString('en-IN')}</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selected.ordersummary?.status}
                  onChange={(e) => updateStatus(selected.orderId, e.target.value)}
                  disabled={statusUpdating}
                  className={`border rounded-md px-3 py-2`}
                >
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <button onClick={() => { setShowModal(false); setSelected(null); }} className="px-3 py-2 bg-gray-100 rounded-md">Close</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold">Customer</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <div className="font-medium">{selected.userId?.first}</div>
                  <div className="font-medium">{selected.ordersummary?.address}</div>
                  <div className="text-sm text-gray-500">{selected.userId?.email || ''}</div>
                  <div className="text-sm text-gray-500">{selected.userId?.phone || ''}</div>
                </div>

                <h3 className="font-semibold mt-4">Summary</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md space-y-2 text-sm">
                  <div className="flex justify-between"><span>Items</span><span>{selected.products.length}</span></div>
                  <div className="flex justify-between"><span>Subtotal</span><span>₹{selected.ordersummary?.subtotal?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>₹{selected.ordersummary?.tax?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-semibold"><span>Total</span><span>₹{selected.ordersummary?.totalprice?.toLocaleString('en-IN')}</span></div>
                </div>

              </div>

              <div>
                <h3 className="font-semibold">Products</h3>
                <div className="mt-2 space-y-3">
                  {selected.products?.map((p) => (
                    <div key={p.productId} className="flex items-center justify-between bg-white border px-3 py-2 rounded-md">
                      <div className="flex items-center gap-3">
                        <img src={getimagesrc(p.imageurl)} alt={p.productname} className="w-16 h-16 object-cover rounded-md" />
                        <div>
                          <div className="font-medium">{p.productname}</div>
                          <div className="text-sm text-gray-500">Qty: {p.quantity}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold">₹{(p.price * p.quantity).toLocaleString('en-IN')}</div>
                      </div>
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
