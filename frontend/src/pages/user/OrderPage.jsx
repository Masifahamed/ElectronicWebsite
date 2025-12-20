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
        <div className="p-3 sm:p-4 md:p-5 lg:p-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 lg:mb-6">Your Cart</h1>

            {cart.length === 0 ? (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 lg:p-12 text-center">
                    <ShoppingCart className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-4 sm:mb-5 md:mb-6" />
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-600 mb-6 sm:mb-8 max-w-sm sm:max-w-md md:max-w-lg mx-auto text-xs sm:text-sm md:text-base lg:text-lg">
                        Looks like you haven't added any products to your cart yet. Start shopping to discover amazing products!
                    </p>
                    <button
                        className="bg-blue-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3.5 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm md:text-base lg:text-lg cursor-pointer"
                        onClick={() => navigate('/product')}>
                        <span>Continue Shopping</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            ) : (
                <div className="w-full mx-auto">
                    {/* Mobile Layout (Stacked) */}
                    <div className="lg:hidden">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div
                                    key={String(item.productId)}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md mb-3 sm:mb-4"
                                >
                                    {/* Product Row */}
                                    <div className="flex gap-3 sm:gap-4 items-start mb-3 sm:mb-4">
                                        <img
                                            src={getimagesrc(item.imageurl) || item.imageurl}
                                            alt={item.productname}
                                            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-sm sm:text-base md:text-lg font-semibold truncate">
                                                {item.productname}
                                            </h2>
                                            <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2 flex-wrap">
                                                <span className="text-xs sm:text-sm md:text-base text-gray-600">
                                                    ₹{item.price}
                                                </span>
                                                <span className="text-xs sm:text-sm text-green-600 font-semibold">
                                                    {item.discount ?? 0}% OFF
                                                </span>
                                                <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                                    <Star size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                                                    {item.rating ?? "-"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Delete Button (Mobile) */}
                                        <button
                                            onClick={() => deleteItem(item.productId)}
                                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash size={16} className="sm:w-5 sm:h-5" />
                                        </button>
                                    </div>

                                    {/* Bottom Row - Quantity & Total */}
                                    <div className="flex justify-between items-center border-t pt-3 sm:pt-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <button
                                                onClick={() => decreaseQuantity(item.productId, item.quantity)}
                                                className="p-1.5 sm:p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                            >
                                                <Minus size={14} className="sm:w-4 sm:h-4" />
                                            </button>

                                            <span className="font-bold text-sm sm:text-base min-w-[24px] text-center">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => increaseQuantity(item.productId)}
                                                className="p-1.5 sm:p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                            >
                                                <Plus size={14} className="sm:w-4 sm:h-4" />
                                            </button>
                                        </div>

                                        {/* Total Price */}
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="text-xs text-gray-500">
                                                    ₹{item.price.toLocaleString("en-IN")} each
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Desktop/Tablet Layout (Grid) */}
                    <div className="hidden lg:block max-w-7xl mx-auto">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div
                                    key={String(item.productId)}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white p-5 rounded-2xl shadow-md mb-4 grid grid-cols-12 gap-4 items-center"
                                >
                                    {/* Product Info - 4 columns */}
                                    <div className="col-span-4 flex gap-4 items-center">
                                        <img
                                            src={getimagesrc(item.imageurl) || item.imageurl}
                                            alt={item.productname}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0">
                                            <h2 className="text-lg font-semibold truncate">
                                                {item.productname}
                                            </h2>
                                            <p className="text-gray-600">
                                                ₹{item.price}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating & Discount - 2 columns */}
                                    <div className="col-span-2 flex flex-col gap-1">
                                        <span className="text-gray-500 flex items-center gap-1">
                                            <Star size={16} />
                                            {item.rating ?? "-"}
                                        </span>
                                        <span className="text-green-600 font-semibold">
                                            {item.discount ?? 0}% OFF
                                        </span>
                                    </div>

                                    {/* Price - 2 columns */}
                                    <div className="col-span-2 text-right">
                                        <p className="font-semibold text-gray-900">
                                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                        </p>
                                        {item.quantity > 1 && (
                                            <p className="text-sm text-gray-500">
                                                ₹{item.price.toLocaleString("en-IN")} each
                                            </p>
                                        )}
                                    </div>

                                    {/* Quantity Controls - 2 columns */}
                                    <div className="col-span-2 flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => decreaseQuantity(item.productId, item.quantity)}
                                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="font-bold min-w-[30px] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQuantity(item.productId)}
                                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    {/* Delete Button - 1 column */}
                                    <div className="col-span-1 flex justify-end">
                                        <button
                                            onClick={() => deleteItem(item.productId)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-md my-4 sm:my-5 md:my-6">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-5 flex items-center gap-2">
                            <SaveIcon className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" /> Order Summary
                        </h2>

                        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-700">Subtotal ({cart.length} items)</span>
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

                            <hr className="my-2 sm:my-3" />

                            <div className="flex justify-between text-base sm:text-lg md:text-xl font-bold text-purple-700">
                                <span>Total</span>
                                <span>₹{totalprice.toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Section */}
                    <div className="space-y-4 sm:space-y-5 md:space-y-6">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Checkout</h1>

                        {/* Payment Method */}
                        <div className="bg-white shadow-sm sm:shadow p-3 sm:p-4 md:p-5 rounded-lg">
                            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
                                Choose Payment Method
                            </h2>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                <button
                                    onClick={() => handlePaymentSelection("Cash on delivery")}
                                    className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg border text-xs sm:text-sm md:text-base transition-colors
                ${paymentMethod === "Cash on delivery"
                                            ? "bg-purple-600 text-white border-purple-600"
                                            : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                                        }`}
                                >
                                    Cash on Delivery
                                </button>
                                {/* Add more payment buttons here if needed */}
                            </div>
                        </div>
                        {
                            showPopup && (
                                <SuccessPopup onClick={() => setShowPopup(false)} title={message} bgcolor={"success"} />
                            )
                        }
                        {/* Address */}
                        {showAddressForm && (
                            <div className="bg-white shadow-sm sm:shadow p-3 sm:p-4 md:p-5 rounded-lg">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">
                                    Delivery Address
                                </h2>

                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your full delivery address..."
                                    className="w-full h-24 sm:h-28 md:h-32 border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows={4}
                                />
                            </div>
                        )}

                        {/* Place Order Button */}
                        {paymentMethod && address && (
                            <div className="sticky bottom-0 bg-white p-3 sm:p-4 border-t shadow-lg sm:shadow-none sm:border-0 sm:static">
                                <button
                                    onClick={placeOrder}
                                    disabled={isPlacing}
                                    className={`w-full py-2.5 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-colors
                ${isPlacing
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
                                        }`}
                                >
                                    {isPlacing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Placing Order...
                                        </span>
                                    ) : "Place Order"}
                                </button>
                            </div>
                        )}

                        {
                            message && (
                                <p className='text-center text-lg font-medium mt-4 text-blue-600'>
                                    {message}
                                </p>
                            )
                        }

                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderPage;




