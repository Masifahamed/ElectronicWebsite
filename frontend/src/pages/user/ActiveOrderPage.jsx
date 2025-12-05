import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { io } from "socket.io-client";

const API = "http://localhost:3500/api";
const SOCKET_URL="http://localhost:3500"

const ActiveOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  
const socketRef=useRef(null)
  // Fetch only this user's orders
    const fetchOrders = async () => {
    const user=JSON.parse(localStorage.getItem("auth_user"))
    const userId=user?._id
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

useEffect(()=>{
fetchOrders()
},[])
  
useEffect(()=>{
  const user=JSON.parse(localStorage.getItem("auth_user"))
  const userId=user?._id;
  if(!userId){
    alert("please login")
  }
  socketRef.current=io(SOCKET_URL)
  socketRef.current.emit("join_room",userId);
  socketRef.current.on("order_status_updated",(data)=>{
    if(!data||!data.orderId){
      console.log("user not found")
      return 
    }
    setOrders((prev)=>prev.map((order)=>order.orderId===data.orderId?data.order:order))
  })
  return()=>{
  if(socketRef.current)socketRef.current.disconnect()
}
},[])



  const toggleOrderExpansion = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

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
                  Date: {new Date(order.createdAt).toLocaleDateString()}
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
                {order.products.map((p,index) => (
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



// // pages/ActiveOrder.jsx
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   ShoppingCart, 
//   Package, 
//   Truck, 
//   CheckCircle, 
//   Clock, 
//   AlertCircle,
//   MapPin,
//   Phone,
//   Mail,
//   Star,
//   ChevronDown,
//   ChevronUp,
//   Eye,
//   X,
//   RefreshCw
// } from 'lucide-react';

// const ActiveOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState({}); // Store product details by ID
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderDetails, setShowOrderDetails] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [loadingProducts, setLoadingProducts] = useState({});

//   // Load orders from backend API and products
//   useEffect(() => {
//     loadOrdersFromBackend();
//   }, []);

//   const loadOrdersFromBackend = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('http://localhost:3500/api/order/orderlist');
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch orders: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       // Handle different response formats
//       let ordersData = [];
//       if (result.data && Array.isArray(result.data)) {
//         ordersData = result.data;
//       } else if (Array.isArray(result)) {
//         ordersData = result;
//       } else {
//         console.warn('Unexpected API response format:', result);
//       }

//       // Transform backend data to match frontend structure
//       const transformedOrders = ordersData.map(order => ({
//         id: order._id,
//         status: mapStatusToFrontend(order.status),
//         statusText: mapStatusTextToFrontend(order.status),
//         date: order.date ? new Date(order.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         expectedDelivery: calculateExpectedDelivery(order.date),
//         totalAmount: order.totalprice || order.totalAmount || 0,
//         items: mapItemsToFrontend(order),
//         shippingAddress: {
//           name: order.address?.fullname || 'Customer',
//           street: order.address?.addressline || 'Address not provided',
//           city: order.address?.district || 'City not provided',
//           state: order.address?.state || 'State not provided',
//           zipCode: order.address?.pincode || '000000',
//           phone: order.address?.phone || '+91 00000 00000',
//           email: order.address?.email || 'email@example.com'
//         },
//         paymentMethod: order.paymentmethod || 'Not specified',
//         trackingNumber: order.trackingNumber || `TRK${order._id}`
//       }));

//       setOrders(transformedOrders);
      
//       // Load product details for all order items
//       loadProductDetails(transformedOrders);
      
//     } catch (error) {
//       console.error('Error loading orders from backend:', error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   // Helper functions to transform backend data
//   const mapStatusToFrontend = (backendStatus) => {
//     const statusMap = {
//       'Active': 'processing',
//       'Processing': 'processing',
//       'Shipped': 'shipped',
//       'Delivered': 'delivered',
//       'Cancelled': 'cancelled'
//     };
//     return statusMap[backendStatus] || 'processing';
//   };

//   const mapStatusTextToFrontend = (backendStatus) => {
//     const statusTextMap = {
//       'Active': 'Processing',
//       'Processing': 'Processing',
//       'Shipped': 'Shipped',
//       'Delivered': 'Delivered',
//       'Cancelled': 'Cancelled'
//     };
//     return statusTextMap[backendStatus] || 'Processing';
//   };

//   const calculateExpectedDelivery = (orderDate) => {
//     const date = orderDate ? new Date(orderDate) : new Date();
//     date.setDate(date.getDate() + 5);
//     return date.toISOString().split('T')[0];
//   };

//   const mapItemsToFrontend = (order) => {
//     if (order.items && Array.isArray(order.items)) {
//       return order.items.map(item => ({
//         id: item._id || item.productId || item.id,
//         name: item.productname || item.name || 'Product',
//         image: item.imageurl || item.image || '/api/placeholder/80/80',
//         price: item.price || 0,
//         quantity: item.quantity || 1,
//         discount: item.discount || 0,
//         rating: item.rating || 4.0,
//         reviews: item.reviews || 0,
//         category: item.category || 'General'
//       }));
//     }

//     return [{
//       id: order._id,
//       name: `Order ${order._id}`,
//       image: '/api/placeholder/80/80',
//       price: order.totalprice || order.totalAmount || 0,
//       quantity: 1,
//       discount: 0,
//       rating: 4.0,
//       reviews: 0,
//       category: 'General'
//     }];
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       alert(`Order status updated to: ${newStatus}`);
//       loadOrdersFromBackend();
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       alert('Failed to update order status');
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
//       case 'shipped': return <Truck className="w-5 h-5 text-orange-500" />;
//       case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case 'cancelled': return <AlertCircle className="w-5 h-5 text-red-500" />;
//       default: return <Clock className="w-5 h-5 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'processing': return 'bg-blue-100 text-blue-800';
//       case 'shipped': return 'bg-orange-100 text-orange-800';
//       case 'delivered': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const toggleOrderExpansion = (orderId) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowOrderDetails(true);
//   };

//   const calculateSavings = (items) => {
//     return items.reduce((total, item) => {
//       const enrichedItem = getEnrichedItem(item);
//       const originalPrice = enrichedItem.discount > 0 ? 
//         enrichedItem.price / (1 - enrichedItem.discount / 100) : enrichedItem.price;
//       return total + (originalPrice - enrichedItem.price) * enrichedItem.quantity;
//     }, 0);
//   };

//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric'
//       });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const OrderProgress = ({ status }) => {
//     const steps = [
//       { key: 'processing', label: 'Processing', completed: true },
//       { key: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
//       { key: 'delivered', label: 'Delivered', completed: status === 'delivered' }
//     ];

//     return (
//       <div className="flex items-center justify-between mb-4">
//         {steps.map((step, index) => (
//           <div key={step.key} className="flex items-center flex-1">
//             <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                 step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
//               }`}>
//                 {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
//               </div>
//               <span className="text-xs mt-1 text-gray-600">{step.label}</span>
//             </div>
//             {index < steps.length - 1 && (
//               <div className={`flex-1 h-1 mx-2 ${
//                 steps[index + 1].completed ? 'bg-green-500' : 'bg-gray-300'
//               }`} />
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // Loading component for product images
//   const ProductImageWithLoader = ({ item }) => {
//     const enrichedItem = getEnrichedItem(item);
//     const isLoading = loadingProducts[item.id];

//     if (isLoading) {
//       return (
//         <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
//           <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
//         </div>
//       );
//     }

//     return (
//       <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
//         <img
//           src={enrichedItem.imageurl}
//           alt={enrichedItem.productname}
//           className="w-full h-full object-cover rounded-lg"
//           onError={(e) => {
//             const initial = enrichedItem.name ? enrichedItem.name.charAt(0).toUpperCase() : 'P';
//             const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
//             const color = colors[enrichedItem.name.length % colors.length];
            
//             e.target.style.display = 'none';
//             e.target.parentElement.innerHTML = `
//               <div class="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-lg" style="background-color: ${color}">
//                 ${initial}
//               </div>
//             `;
//           }}
//         />
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-600">Loading your orders...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={loadOrdersFromBackend}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Active Orders</h1>
//             <p className="text-gray-600">Track and manage your active orders</p>
//           </div>
//           <button
//             onClick={loadOrdersFromBackend}
//             className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span>Refresh</span>
//           </button>
//         </div>

//         {/* Orders List */}
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <motion.div
//               key={order.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
//             >
//               {/* Order Header */}
//               <div 
//                 className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
//                 onClick={() => toggleOrderExpansion(order.id)}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     {getStatusIcon(order.status)}
//                     <div>
//                       <h3 className="font-semibold text-lg text-gray-900">
//                         Order {order.id}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         Placed on {formatDate(order.date)}
//                         {order.deliveredDate && ` • Delivered on ${formatDate(order.deliveredDate)}`}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-6">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                       {order.statusText}
//                     </span>
//                     <span className="text-lg font-bold text-gray-900">
//                       ₹{order.totalAmount.toLocaleString('en-IN')}
//                     </span>
//                     {expandedOrder === order.id ? (
//                       <ChevronUp className="w-5 h-5 text-gray-400" />
//                     ) : (
//                       <ChevronDown className="w-5 h-5 text-gray-400" />
//                     )}
//                   </div>
//                 </div>

//                 {/* Progress Bar */}
//                 {['processing', 'shipped'].includes(order.status) && (
//                   <div className="mt-4">
//                     <OrderProgress status={order.status} />
//                     <p className="text-sm text-gray-600 text-center">
//                       Expected delivery: {formatDate(order.expectedDelivery)}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Expanded Order Details */}
//               <AnimatePresence>
//                 {expandedOrder === order.id && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: 'auto', opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     className="border-t border-gray-200"
//                   >
//                     <div className="p-6">
//                       {/* Products */}
//                       <div className="mb-6">
//                         <h4 className="font-semibold text-gray-900 mb-4">Products ({order.items.length})</h4>
//                         {order.items.length > 0 ? (
//                           <div className="space-y-4">
//                             {order.items.map((item) => {
//                               const enrichedItem = getEnrichedItem(item);
//                               return (
//                                 <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
//                                   <ProductImageWithLoader item={item} />
//                                   <div className="flex-1">
//                                     <h5 className="font-medium text-gray-900">{enrichedItem.name}</h5>
//                                     <div className="flex items-center space-x-4 text-sm text-gray-600">
//                                       <span>Qty: {enrichedItem.quantity}</span>
//                                       <span>•</span>
//                                       <div className="flex items-center">
//                                         <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
//                                         {enrichedItem.rating} ({enrichedItem.reviews} reviews)
//                                       </div>
//                                       <span>•</span>
//                                       <span>{enrichedItem.category}</span>
//                                     </div>
//                                     {enrichedItem.description && (
//                                       <p className="text-sm text-gray-500 mt-1">{enrichedItem.description}</p>
//                                     )}
//                                   </div>
//                                   <div className="text-right">
//                                     <p className="font-semibold text-gray-900">₹{(enrichedItem.price * enrichedItem.quantity).toLocaleString('en-IN')}</p>
//                                     {enrichedItem.discount > 0 && (
//                                       <p className="text-sm text-green-600">{enrichedItem.discount}% OFF</p>
//                                     )}
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         ) : (
//                           <p className="text-gray-500 text-center py-4">No products in this order</p>
//                         )}
//                       </div>

//                       {/* Rest of the order details remains the same */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
//                           <div className="space-y-2 text-sm">
//                             <div className="flex justify-between">
//                               <span>Items Total:</span>
//                               <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
//                             </div>
//                             <div className="flex justify-between text-green-600">
//                               <span>Total Savings:</span>
//                               <span>-₹{calculateSavings(order.items).toLocaleString('en-IN')}</span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span>Shipping:</span>
//                               <span className="text-green-600">FREE</span>
//                             </div>
//                             <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
//                               <span>Total Amount:</span>
//                               <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Shipping Info */}
//                         <div>
//                           <h4 className="font-semibold text-gray-900 mb-4">Shipping Information</h4>
//                           <div className="space-y-2 text-sm">
//                             <div className="flex items-start space-x-2">
//                               <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
//                               <div>
//                                 <p className="font-medium">{order.shippingAddress.name}</p>
//                                 <p className="text-gray-600">{order.shippingAddress.street}</p>
//                                 <p className="text-gray-600">
//                                   {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <Phone className="w-4 h-4 text-gray-400" />
//                               <span className="text-gray-600">{order.shippingAddress.phone}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <Mail className="w-4 h-4 text-gray-400" />
//                               <span className="text-gray-600">{order.shippingAddress.email}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
//                         <div className="flex space-x-4">
//                           <button
//                             onClick={() => viewOrderDetails(order)}
//                             className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           >
//                             <Eye className="w-4 h-4" />
//                             <span>View Details</span>
//                           </button>
//                           {order.status === 'shipped' && (
//                             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                               Track Package
//                             </button>
//                           )}
//                         </div>
                        
//                         {/* Admin Actions */}
//                         <div className="flex space-x-2">
//                           {order.status === 'processing' && (
//                             <button
//                               onClick={() => updateOrderStatus(order.id, 'shipped')}
//                               className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
//                             >
//                               Mark Shipped
//                             </button>
//                           )}
//                           {order.status === 'shipped' && (
//                             <button
//                               onClick={() => updateOrderStatus(order.id, 'delivered')}
//                               className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
//                             >
//                               Mark Delivered
//                             </button>
//                           )}
//                           {order.status !== 'cancelled' && order.status !== 'delivered' && (
//                             <button
//                               onClick={() => updateOrderStatus(order.id, 'cancelled')}
//                               className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
//                             >
//                               Cancel Order
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           ))}
//         </div>

//         {/* No Orders State */}
//         {orders.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Orders</h3>
//             <p className="text-gray-600 mb-6">You don't have any active orders at the moment.</p>
//             <button 
//               onClick={loadOrdersFromBackend}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Refresh Orders
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Order Details Modal - Updated to use enriched product data */}
//       <AnimatePresence>
//         {showOrderDetails && selectedOrder && (
//           <OrderDetailsModal 
//             order={selectedOrder} 
//             products={products}
//             getEnrichedItem={getEnrichedItem}
//             onClose={() => setShowOrderDetails(false)} 
//             formatDate={formatDate}
//             getStatusColor={getStatusColor}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // Updated Order Details Modal Component
// const OrderDetailsModal = ({ order, products, getEnrichedItem, onClose, formatDate, getStatusColor }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//     onClick={onClose}
//   >
//     <motion.div
//       initial={{ scale: 0.9, opacity: 0 }}
//       animate={{ scale: 1, opacity: 1 }}
//       exit={{ scale: 0.9, opacity: 0 }}
//       className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">
//             Order Details - {order.id}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Products Details */}
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-4">Products</h3>
//             <div className="space-y-4">
//               {order.items.map((item) => {
//                 const enrichedItem = getEnrichedItem(item);
//                 return (
//                   <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
//                     <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
//                       <img
//                         src={enrichedItem.image}
//                         alt={enrichedItem.name}
//                         className="w-full h-full object-cover rounded-lg"
//                         onError={(e) => {
//                           const initial = enrichedItem.name ? enrichedItem.name.charAt(0).toUpperCase() : 'P';
//                           const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
//                           const color = colors[enrichedItem.name.length % colors.length];
                          
//                           e.target.style.display = 'none';
//                           e.target.parentElement.innerHTML = `
//                             <div class="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-lg" style="background-color: ${color}">
//                               ${initial}
//                             </div>
//                           `;
//                         }}
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-medium text-gray-900">{enrichedItem.productname}</h4>
//                       <p className="text-sm text-gray-600 mb-2">{enrichedItem.category}</p>
//                       <div className="flex items-center space-x-4 text-sm">
//                         <div className="flex items-center">
//                           <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
//                           {enrichedItem.rating} ({enrichedItem.reviews} reviews)
//                         </div>
//                         <span>•</span>
//                         {enrichedItem.discount > 0 && (
//                           <span className="text-green-600">{enrichedItem.discount}% OFF</span>
//                         )}
//                       </div>
//                       {enrichedItem.description && (
//                         <p className="text-sm text-gray-500 mt-2">{enrichedItem.description}</p>
//                       )}
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold">₹{(enrichedItem.price * enrichedItem.quantity).toLocaleString('en-IN')}</p>
//                       <p className="text-sm text-gray-600">Qty: {enrichedItem.quantity}</p>
//                       <p className="text-sm text-gray-600">₹{enrichedItem.price.toLocaleString('en-IN')} each</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Order & Shipping Info */}
//           <div className="space-y-6">
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-4">Order Information</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Order Date:</span>
//                   <span className="font-medium">{formatDate(order.date)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Status:</span>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                     {order.statusText}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Payment Method:</span>
//                   <span className="font-medium">{order.paymentMethod}</span>
//                 </div>
//                 {order.trackingNumber && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tracking Number:</span>
//                     <span className="font-medium">{order.trackingNumber}</span>
//                   </div>
//                 )}
//                 {order.expectedDelivery && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Expected Delivery:</span>
//                     <span className="font-medium">{formatDate(order.expectedDelivery)}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="font-medium">{order.shippingAddress.name}</p>
//                 <p className="text-gray-600">{order.shippingAddress.street}</p>
//                 <p className="text-gray-600">
//                   {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
//                 </p>
//                 <p className="text-gray-600 mt-2">{order.shippingAddress.phone}</p>
//                 <p className="text-gray-600">{order.shippingAddress.email}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   </motion.div>
// );

// export default ActiveOrder;