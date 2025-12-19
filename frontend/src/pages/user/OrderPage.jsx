import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingCart, Trash, ArrowRight, Star, SaveIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SuccessPopup from '../../components/user/SuccessPopup'
import { backend } from '../../ultis/constant'



const CartAPI = "http://localhost:3500/api/cart/";
const API_BASE = "http://localhost:3500"

const OrderPage = () => {
    const navigate = useNavigate()
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("")
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [address, setAddress] = useState("")
    const [message, setmessage] = useState("")
    const [showPopup, setShowPopup] = useState(false)
    const [isPlacing, setIsPlacing] = useState(false)

    const user = JSON.parse(localStorage.getItem("auth_user"));
    const userId = user?._id;

    // Load cart items
    const loadCart = async () => {
        try {
            const res = await axios.get(`${backend}/api/cart/single/${userId}`);
            setCart(res.data.data.cartlist || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) loadCart();
        else setLoading(false);
    }, [userId]);

    // Increase Qty
    const increaseQuantity = async (productId) => {
        try {
            await axios.post(`${CartAPI}increase`, { userId, productId });
            await loadCart();
        } catch (err) {
            console.log("increase error", err);
        }
    };

    const getimagesrc = (imageurl) => {
        if (!imageurl) return "/no-image.png"
        if (imageurl.startsWith("http")) {
            return imageurl
        }
        return `${backend}${imageurl}`
    }

    // Decrease Qty
    const decreaseQuantity = async (productId, quantity) => {
        //if (quantity <= 1) return;
        try {
            await axios.post(`${CartAPI}decrease`, { userId, productId, quantity });
            await loadCart();
        } catch (err) {
            console.log("decrease error", err);
        }
    };

    // Delete Item
    const deleteItem = async (productId) => {
        try {
            await axios.delete(`${backend}/api/cart/delete/${userId}/${productId}`);
            await loadCart();
        } catch (err) {
            console.log("delete error", err);
        }
    };
    //console.log(cart)
    // Calculations
    const subtotal = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
    const tax = +(subtotal * 0.05).toFixed(2);

    const saving = cart.reduce((total, item) => {
        const itemSaving = (item.originalprice - item.price) * (item.quantity || 0);
        return total + Math.max(itemSaving, 0);
    }, 0);
    //console.log(saving)
    const totalprice = +(subtotal + tax).toFixed(2);

    // total quantity of products (sum of qty)
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

    const handlePaymentSelection = (method) => {
        setPaymentMethod(method)
        setShowAddressForm(true)
    }

    const placeOrder = async () => {

        try {

            if (!address || address.trim().length < 5) {
                setmessage("Please enter a valid address");
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 1800);
                return;
            }

            if (cart.length === 0) {
                setmessage("Your cart is empty");
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 1800);
                return;
            }

            setIsPlacing(true);
            const orderPayload = {
                userId,
                products: cart.map((item) => ({
                    productId: item.productId,
                    productname: item.productname,
                    imageurl: item.imageurl,
                    price: item.price,
                    originalprice: item.originalprice,
                    quantity: item.quantity,
                    discount: item.discount,
                    category: item.category,
                    rating: item.rating
                })),
                ordersummary: {
                    items: totalItems,          // total quantity
                    subtotal: subtotal,
                    saving: saving,
                    tax: tax,
                    totalprice: totalprice,
                    paymentmethod: paymentMethod,
                    status: "Pending",
                    address: address
                }
            };

            const res = await axios.post(`${backend}/api/order/createorder`, orderPayload);

            // clear cart on backend
            if (res.data.success) {
                await axios.delete(`${backend}/api/cart/deletecart/${userId}`);
                // alert("Order Placed Successfully")
                setmessage("Order Placed Successfully")
                setShowPopup(true)
                setTimeout(() => {
                    navigate('/orders/active');
                }, 1500);
            }

        } catch (err) {
            console.log("Order error", err);
            setIsPlacing(false);
            alert("failed to place the order")
        }
        // return handleOnlinePayment()

    }

    if (loading) return (
        <div className="text-center p-10">
            <p>Loading Cart...</p>
        </div>
    );

    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold mb-5">Your Cart</h1>

            {cart.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
                    <ShoppingCart className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm md:text-base">
                        Looks like you haven't added any products to your cart yet. Start shopping to discover amazing products!
                    </p>
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 text-sm md:text-base cursor-pointer"
                        onClick={() => navigate('/product')}>
                        <span>Continue Shopping</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            ) : (
                <div>
                    <AnimatePresence>
                        {cart.map((item) => (
                            <motion.div
                                key={String(item.productId)}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-between bg-white p-4 shadow-md rounded-xl mb-4"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={getimagesrc(item.imageurl)||item.imageurl}
                                        alt={item.productname}
                                        className="w-24 h-24 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold">{item.productname}</h2>
                                        <p className="text-gray-600">₹{item.price}</p>

                                    </div>
                                </div>

                                <span className='text-gray-500 flex items-center gap-1'>
                                    <Star />
                                    {item.rating ?? '-'}
                                </span>

                                <div className='text-green-600 font-semibold'>
                                    {item.discount ?? 0}% OFF
                                </div>

                                <div className="text-right min-w-20">
                                    <p className="font-semibold text-gray-900 text-sm md:text-base">
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                    </p>
                                    {item.quantity > 1 && (
                                        <p className="text-xs text-gray-500">
                                            ₹{item.price.toLocaleString('en-IN')} each
                                        </p>
                                    )}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => decreaseQuantity(item.productId, item.quantity)}
                                        className="p-2 bg-blue-200 rounded-lg cursor-pointer hover:bg-blue-300"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQuantity(item.productId)}
                                        className="p-2 bg-blue-200 rounded-lg cursor-pointer hover:bg-blue-300"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {/* Delete */}
                                <button onClick={() => deleteItem(item.productId)} className='p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer'>
                                    <Trash size={20} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="bg-white p-6 rounded-2xl shadow-md mb-6 mt-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <SaveIcon className="text-purple-600" /> Order Summary
                        </h2>

                        <div className="space-y-3 text-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex justify-between text-green-600 font-semibold">
                                <span>Savings</span>
                                <span> ₹{saving.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-700">Tax (5%)</span>
                                <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
                            </div>

                            <hr className="my-3" />

                            <div className="flex justify-between text-xl font-bold text-purple-700">
                                <span>Total ({cart.length})</span>
                                <span>₹{totalprice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-4">Checkout</h1>

                    {/* Payment Options */}
                    <div className="bg-white shadow p-4 rounded-lg mb-6">
                        <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>

                        <div className="flex gap-4">
                            <button
                                onClick={() => handlePaymentSelection("Cash on delivery")}
                                className={`px-4 py-2 rounded-lg border ${paymentMethod === "Cash on delivery"
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100"
                                    }`}
                            >
                                Cash on Delivery
                            </button>
                        </div>
                    </div>

                    {/* Success/Error Popup */}
                    {showPopup && (
                        <SuccessPopup onClick={() => setShowPopup(false)} title={message} bgcolor={"success"} />
                    )}

                    {/* Address Form */}
                    {showAddressForm && (
                        <div className="bg-white shadow p-4 rounded-lg mb-6">
                            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full delivery address..."
                                className="w-full h-32 border p-3 rounded-lg resize-none"
                            ></textarea>
                        </div>
                    )}

                    {paymentMethod && address && (
                        <button
                            onClick={placeOrder}
                            disabled={isPlacing}
                            className={`w-full ${isPlacing ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white py-3 rounded-lg text-lg font-semibold transition`}
                        >
                            {isPlacing ? 'Placing Order...' : 'Place Order'}
                        </button>
                    )}

                    {message && (
                        <p className='text-center text-lg font-medium mt-4 text-blue-600'>
                            {message}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderPage;


