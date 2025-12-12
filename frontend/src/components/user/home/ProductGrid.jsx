import { useRef, useState, useEffect, useCallback } from 'react';
//import { products } from '../../../ultis/constant';
import { Heart, Eye, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '../../../pages/auth/WithAuth';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import SuccessPopup from '../SuccessPopup'
import { Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3500/api'

const ProductGrid = () => {
    const { isAuthenticated, requireAuth } = useAuth();
    const [showProductPopup, setShowProductPopup] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [showCartMessage, setShowCartMessage] = useState(false)
    const navigate = useNavigate()
    const [todaysale, setTodaysale] = useState([])
    const [cart, setCart] = useState([]);
    const [likedProducts, setLikedProducts] = useState({});
    const [successmessage, setsuccessmessage] = useState('')
    const [showpopup, setShowpopup] = useState(false)
    const user = JSON.parse(localStorage.getItem("auth_user"))
    const userId = user?._id


    const loadWishlist = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/wishlist/single/${userId}`);
            const data = await res.json();

            const liked = {};

            if (data?.data?.product) {
                data.data.product.forEach(item => {
                    liked[item.productId] = true;   // mark product as liked
                });
            }

            setLikedProducts(liked);
        } catch (err) {
            console.log("Wishlist fetch error:", err);
        }
    }, [userId]);


    useEffect(() => {
        loadWishlist();
    }, [loadWishlist]);

    // useEffect(() => {
    //     fetchtodayproduct()
    // }, [userId])

    useEffect(() => {
        const fetchtodayproduct = async () => {
            try {
                const res = await axios.get(`${API_BASE}/product`)
                const today = res.data.data
                const saleproduct = today.map(p => ({
                    ...p,
                    _id: p._id || p.id,
                    imageurl: p.imageurl,
                    originalprice: p.originalprice,
                    rating: p.rating && p.rating <= 5 ? p.rating : Math.floor(Math.random() * 5) + 1,
                    views: p.views || Math.floor(Math.random() * 1000) + 10,
                    likes: p.likes || Math.floor(Math.random() * 500) + 50,
                    reviews: p.reviews || Math.floor(Math.random() * 100) + 1,
                    inStock: p.stock > 0 || true

                }))
                setTodaysale(saleproduct.slice(0, 6))
            } catch (err) {
                console.log(err)

            }
        }
        fetchtodayproduct()
    }, [])

    const handleProductClick = (item) => {

        setSelectedProduct(item)
        setShowProductPopup(true)
        const cartitem = cart.find((cartitem) => cartitem.productId === item._id)
        if (cartitem) {
            setQuantity(cartitem.quantity)
        } else {
            setQuantity(1)
        }

    }

    const scrollContainerRef = useRef(null);

    const toggleLike = useCallback(async (item, e) => {

        if (e) e.stopPropagation();  // stop card click


        if (!userId) {
            setsuccessmessage("Please login to use wishlist");
            setShowpopup(true);
            setTimeout(() => setShowpopup(false), 2000);
            return;
        }
        try {
            const productId = item._id;
            const isLiked = likedProducts[productId];

            if (!isLiked) {
                await axios.post(
                    `${API_BASE}/wishlist/add`, {
                    userId,
                    productId,
                    imageurl: item.imageurl,
                    productname: item.productname,
                    price: item.price,
                    discount: item.discount,
                    originalprice: item.originalprice,
                    category: item.category,
                    rating: item.rating && item.rating < 5 ? item.rating : Math.floor(Math.random() * 5) + 1,
                    stock: item.stock,
                    description: item.description
                }
                );

                // update UI
                setLikedProducts(prev => ({
                    ...prev,
                    [productId]: true
                }));
                setsuccessmessage("Added to wishlist")
                loadWishlist()
            } else {

                await axios.delete(`${API_BASE}/wishlist/remove/${userId}/${productId}`);


                // update UI
                setLikedProducts(prev => {
                    const newState = { ...prev };
                    delete newState[productId];
                    return newState;

                });
                setsuccessmessage("Remove from wishlist")
                loadWishlist()
            }
            setShowpopup(true);
            setTimeout(() => setShowpopup(false), 2000);
        } catch (err) {
            console.log("Wishlist error:", err);
            setsuccessmessage("Wishlist error");
            setShowpopup(true);
            setTimeout(() => setShowpopup(false), 2000);

        }
    }, [userId, likedProducts, loadWishlist]);


    const addToCart = async (item) => {
        try {

            if (!userId) {
                requireAuth();
                return
            }
            // 2️⃣ Prepare payload EXACTLY as backend expects
            const payload = {
                userId: userId,
                productId: item._id,
                productname: item.productname,
                price: item.price,
                discount: item.discount,
                originalprice: item.originalprice,
                rating: item.rating,
                category: item.category,
                imageurl: item.imageurl,
                quantity:quantity  // selected quantity
            };
            const res = await axios.post("http://localhost:3500/api/cart/add", payload)
            console.log(res.data.message)
            setShowCartMessage(true)
            setShowProductPopup(false)
            setTimeout(() => {
                setShowCartMessage(false)
            }, 3000);
        } catch (err) {
            console.log(err)

        }
        //Authentication is here
    };
    // Load cart
    const loadCart = async () => {
        if (!userId) return
        try {
            const savedCart = await axios.get(`${API_BASE}/cart/single/${userId}`);
            setCart(savedCart.data.data.cartlist)
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }
    useEffect(() => {
        loadCart()
    }, [userId])

    const increaseQuantity = async (productId) => {
        const newqty = quantity + 1
        setQuantity(newqty)
        await axios.post(`http://localhost:3500/api/cart/increase`, {
            userId,
            productId,
            quantity: newqty
        })
        loadCart()
    }
    const decreaseQuantity = async (productId, quantity) => {
        if (quantity <= 1) return

        const newQty = quantity - 1
        setQuantity(newQty)

        await axios.post(`http://localhost:3500/api/cart/decrease`, {
            userId,
            productId,
            quantity: newQty
        })
        loadCart()
        //setQuantity(prev => prev > 1 ? prev - 1 : 1);
    };


    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className="relative">
                {/* Navigation Buttons */}
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                    aria-label="Scroll left"
                >
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 transform cursor-pointer -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
                    aria-label="Scroll right"
                >
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Products Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {todaysale.map((item) => (
                        <div
                            key={item._id}
                            className="flex-none w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                            onClick={() => handleProductClick(item)}
                        >
                            {/* Product Image */}
                            <div className="relative">
                                <img
                                    src={item.imageurl}
                                    alt={item.productname}
                                    className="w-full h-48 object-cover rounded-t-2xl"
                                />
                                {/* Discount Badge */}
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {item.discount}%
                                </div>
                                {/* Like Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering product click
                                        toggleLike(item, e)
                                    }}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300"
                                // aria-label={likedProducts[item._id] ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    <Heart
                                        className={`w-5 h-5 ${likedProducts[item._id]
                                            ? 'text-red-500 fill-red-500'
                                            : 'text-gray-600'
                                            }`}
                                    />
                                </button>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
                                    {item.productname}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center mb-3">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(item.rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                                fill={i < Math.floor(item.rating) ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-2">
                                        {item.rating} ({item.reviews} reviews)
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl font-bold text-gray-900">
                                        ₹{item.price}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through ml-2">
                                        ₹{item.originalprice}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-between text-sm text-gray-600 border-t border-gray-100 pt-3 mb-4">
                                    <div className="flex items-center">
                                        <Eye className="w-4 h-4 mr-1" />
                                        {item.views} views
                                    </div>
                                    <div className="flex items-center">
                                        <Heart className="w-4 h-4 mr-1" />
                                        {item.likes} likes
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering product click
                                        addToCart(item);
                                    }}
                                    className="w-full bg-gradient-to-r from-[#9B77E7] to-[#1600A0] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Add to Cart</span>
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
                {
                    showpopup && (
                        <SuccessPopup title={successmessage} bgcolor='success' />
                    )
                }
                {/* Product Info popup information */}
                <AnimatePresence>
                    {showProductPopup && selectedProduct && (
                        <motion.div initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            onClick={() => setShowProductPopup(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="grid grid-cols-1 relative pb-10">

                                    <div className='flex gap-8 p-6'>
                                        <div className='relative'>
                                            <img src={selectedProduct.imageurl} alt={selectedProduct.productname}
                                                className='w-500 h-96 object-cover rounded-2xl'
                                            />
                                            <div className='absolute top-4 m-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                                                {selectedProduct.discount}%OFF
                                            </div>
                                        </div>


                                        <div className='space-y-6 w-full'>
                                            <div className='relative flex-col items-center justify-between'>
                                                <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                                                    {selectedProduct.productname}
                                                </h2>
                                                <p className='text-gray-600 mb-4'>
                                                    {selectedProduct.description || "Premium quality product with excellent features and performance."}
                                                </p>
                                            </div>
                                            {/* Price */}
                                            <div className="space-y-2 flex-col items-center gap-10">
                                                <div className="flex items-center">
                                                    <span className="text-4xl font-bold text-gray-900">
                                                        ₹{selectedProduct.price}
                                                    </span>
                                                    <span className="text-2xl font-bold text-gray-500 line-through ml-3">
                                                        ₹{selectedProduct.originalprice}
                                                    </span>
                                                </div>
                                                <p className="text-green-600 font-semibold">
                                                    You save ₹{selectedProduct.originalprice - selectedProduct.price} ({selectedProduct.discount}% OFF)
                                                </p>
                                            </div>
                                            <div className="flex-col gap-5">
                                                {/* Quantity Selector */}
                                                <div className="space-y-3 flex-col">
                                                    <label className="block text-[30px] font-medium text-gray-700">Quantity</label>
                                                    <div className="flex items-center space-x-4">
                                                        <button
                                                            onClick={() => decreaseQuantity(selectedProduct._id, quantity)}
                                                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="text-xl font-semibold w-8 text-center">
                                                            {quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => increaseQuantity(selectedProduct._id)}
                                                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* Action button */}
                                                <div className='flex space-x-4 pt-4 items-center align-center gap-5 relative'>
                                                    <button onClick={() => addToCart(selectedProduct)} className='bg-gradient-to-r from-[#9B77E7] to-[#1600A0] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-4 p-4'>
                                                        <ShoppingCart className='w-5 h-5' />
                                                        <span>Add to Cart - ₹{selectedProduct.price * quantity}</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent triggering product click
                                                            toggleLike(selectedProduct, e);
                                                        }}
                                                        className="cursor-pointer  w-14 h-14 bg-gray-200 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-300"
                                                        aria-label={likedProducts[selectedProduct._id] ? "Remove from wishlist" : "Add to wishlist"}
                                                    >
                                                        <Heart
                                                            className={`w-10 h-10 ${likedProducts[selectedProduct._id]
                                                                ? 'text-red-500 fill-red-500'
                                                                : 'text-gray-600'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    {/* Additional Info */}
                                    <div className="ms-7 pt-4">
                                        <div className="grid grid-cols-3 text-[30px] gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-semibold">Category:</span> {selectedProduct.category || "Electronics"}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Views:</span> {selectedProduct.reviews}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Likes:</span> {selectedProduct.likes}
                                            </div>
                                            <div>
                                                <span className="font-semibold">In Stock:</span> {selectedProduct.inStock ? "Yes" : "No"}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowProductPopup(false)} className='absolute top-5 right-5 w-10 h-10 bg-gray-200 rounded-full flex items-center cursor-pointer justify-center hover:bg-gray-300 transition-all duration-300'>
                                        <X className='w-20 h-20 text-gray-600' />
                                    </button>
                                </div>
                            </motion.div>

                        </motion.div>
                    )}
                </AnimatePresence>
                {
                    showCartMessage && (
                        <SuccessPopup bgcolor="success" path={() => navigate("/order")} subtitle="View cart" title="Product added to cart" content="to proceed to checkout" onclick={() => setShowCartMessage(false)} />
                    )
                }
            </div>
        </>
    )
}

export default ProductGrid;