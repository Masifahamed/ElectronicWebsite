import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingCart, Trash, ArrowRight, Star, SaveIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SuccessPopup from '../../components/user/SuccessPopup'
import { backend } from '../../ultis/constant'



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
            await axios.post(`${backend}/api/cart/increase`, { userId, productId });
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
            await axios.post(`${backend}/api/cart/decrease`, { userId, productId, quantity });
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
                <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-0">
                    <AnimatePresence>
                        {cart.map((item) => (
                            <motion.div
                                key={String(item.productId)}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white p-4 sm:p-5 rounded-2xl shadow-md mb-4
                   flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                            >
                                {/* Product Info */}
                                <div className="flex gap-4 items-center">
                                    <img
                                        src={getimagesrc(item.imageurl) || item.imageurl}
                                        alt={item.productname}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
                                    />

                                    <div>
                                        <h2 className="text-base sm:text-lg font-semibold">
                                            {item.productname}
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            ₹{item.price}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating & Discount */}
                                <div className="flex justify-between lg:flex-col lg:items-center gap-2 text-sm sm:text-base">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <Star size={16} />
                                        {item.rating ?? "-"}
                                    </span>

                                    <span className="text-green-600 font-semibold">
                                        {item.discount ?? 0}% OFF
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="text-left lg:text-right min-w-[90px]">
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </p>
                                    {item.quantity > 1 && (
                                        <p className="text-xs text-gray-500">
                                            ₹{item.price.toLocaleString("en-IN")} each
                                        </p>
                                    )}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => decreaseQuantity(item.productId, item.quantity)}
                                        className="p-2 bg-blue-200 rounded-lg hover:bg-blue-300"
                                    >
                                        <Minus size={18} />
                                    </button>

                                    <span className="font-bold">{item.quantity}</span>

                                    <button
                                        onClick={() => increaseQuantity(item.productId)}
                                        className="p-2 bg-blue-200 rounded-lg hover:bg-blue-300"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {/* Delete */}
                                <button
                                    onClick={() => deleteItem(item.productId)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-start lg:self-center"
                                >
                                    <Trash size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Order Summary */}
                    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md my-6">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                            <SaveIcon className="text-purple-600" /> Order Summary
                        </h2>

                        <div className="space-y-3 text-sm sm:text-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="font-medium">
                                    ₹{subtotal.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div className="flex justify-between text-green-600 font-semibold">
                                <span>Savings</span>
                                <span>₹{saving.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-700">Tax (5%)</span>
                                <span className="font-medium">
                                    ₹{tax.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <hr />

                            <div className="flex justify-between text-lg sm:text-xl font-bold text-purple-700">
                                <span>Total ({cart.length})</span>
                                <span>₹{totalprice.toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout */}
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4">Checkout</h1>

                    {/* Payment Method */}
                    <div className="bg-white shadow p-4 rounded-lg mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">
                            Choose Payment Method
                        </h2>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handlePaymentSelection("Cash on delivery")}
                                className={`px-4 py-2 rounded-lg border text-sm sm:text-base
          ${paymentMethod === "Cash on delivery"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-100"
                                    }`}
                            >
                                Cash on Delivery
                            </button>
                        </div>
                    </div>

                    {/* Address */}
                    {showAddressForm && (
                        <div className="bg-white shadow p-4 rounded-lg mb-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-3">
                                Delivery Address
                            </h2>

                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full delivery address..."
                                className="w-full h-28 sm:h-32 border p-3 rounded-lg resize-none"
                            />
                        </div>
                    )}

                    {/* Place Order */}
                    {paymentMethod && address && (
                        <button
                            onClick={placeOrder}
                            disabled={isPlacing}
                            className={`w-full py-3 rounded-lg text-base sm:text-lg font-semibold transition
        ${isPlacing
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                        >
                            {isPlacing ? "Placing Order..." : "Place Order"}
                        </button>
                    )}

                    {message && (
                        <p className="text-center text-base sm:text-lg font-medium mt-4 text-blue-600">
                            {message}
                        </p>
                    )}
                </div>

            )}
        </div>
    );
};

export default OrderPage;


