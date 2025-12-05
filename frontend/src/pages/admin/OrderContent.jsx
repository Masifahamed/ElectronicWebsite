// OrdersContent.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Eye, RefreshCw, Trash2, Edit2 } from "lucide-react";

// API base
const API = "http://localhost:3500/api";

const socketUrl = "http://localhost:3500"; // same origin as socket server

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
    socketRef.current = io(socketUrl, { transports: ["websocket"] });

    socketRef.current.on("order_connect", (order) => {
      console.log("Admin socket connected:", socketRef.current.id);
      setOrders((prev) => [order, ...prev])
    });

    // listen for events — refresh or update relevant order(s)
    socketRef.current.on("order_created", (order) => {
      setOrders(prev => [order, ...prev]);
    });
    socketRef.current.on("order_status_updated", ({ orderId, order }) => {
      setOrders(prev => prev.map(o => (o.orderId === orderId ? order : o)));
    });
  

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
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
    try {
      const res = await axios.delete("http://localhost:3500/api/order/deleteorder")
      alert("delete all order")
      setOrders(res.data.data)
    } catch (err) {
      console.log("something wentt wrong")
    }
  }

  const deleteProductFromOrder = async (orderId, productId, userId) => {
    if (!confirm("Remove this product from order?")) return;
    try {
      // route: DELETE /api/order/deleteproduct/:orderId/:productId?userId=... 
      // We'll call endpoint with params and query userId for safety
      const res = await axios.delete(`${API}/order/deleteproduct/${userId}/${orderId}/${productId}`);
      const updated = res.data?.data;
      if (updated) {
        setOrders(prev => prev.map(o => (o.orderId === updated.orderId ? updated : o)));
        if (selected?.orderId === updated.orderId) {
          setSelected(updated);
        }
      }
      alert("Product removed");
    } catch (err) {
      console.error(err);
      alert("Failed to remove product");
    }
  };

 const deletesingleorder = async (userId, orderId) => {
  if (!confirm("Delete this order?")) return;

  try {
    const res = await axios.delete(`${API}/order/deletesingleorder/${userId}/${orderId}`);

    if (res.data.success) {
      // Remove deleted order from UI'
      const remainingorders=res.data.data;
      setOrders(remainingorders)
      if(selected?.orderId===orderId){
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500">Admin order management — live updates</p>
        </div>
        <button onClick={deletealleorder} className="bg-gray-300 px-3 py-2 rounded-md hover:bg-gray-500 cursor-pointer">
          Delete a Entire OrderList
        </button>
        <div className="flex gap-3 items-center">
          <button onClick={fetchOrders} className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
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
                    <td className="text-red-500 px-6 py-4">User{o.userId?.first}</td>
                    <td className="px-6 py-4">{o.products?.length || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold">₹{total.toLocaleString('en-IN')}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold `}>
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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
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
                  className="border rounded-md px-3 py-2"
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
                        <img src={p.imageurl} alt={p.productname} className="w-16 h-16 object-cover rounded-md" />
                        <div>
                          <div className="font-medium">{p.productname}</div>
                          <div className="text-sm text-gray-500">Qty: {p.quantity}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold">₹{(p.price * p.quantity).toLocaleString('en-IN')}</div>
                        <button className="text-red-600 hover:text-red-800" onClick={() => deleteProductFromOrder(selected.orderId, p.productId, selected.userId?._id)}>
                          <Trash2 className="w-5 h-5" />
                        </button>
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

// // helper for status styling
// function getStatusClasses(status) {
//   if (!status) return "bg-gray-100 text-gray-800";
//   const s = String(status).toLowerCase();
//   if (s.includes("deliv")) return "bg-green-100 text-green-800";
//   if (s.includes("ship")) return "bg-blue-100 text-blue-800";
//   if (s.includes("pack") || s.includes("proc") || s.includes("Active")) return "bg-yellow-100 text-yellow-800";
//   if (s.includes("cancel")) return "bg-red-100 text-red-800";
//   return "bg-gray-100 text-gray-800";
// }


