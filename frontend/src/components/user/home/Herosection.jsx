import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, ShoppingCart, Eye, Star, Heart, Share2, LoaderIcon } from 'lucide-react';
import axios from 'axios';
import SuccessPopup from './../SuccessPopup'
const API_CART = "http://localhost:3500/api/cart"
const API_HERO = "http://localhost:3500/api/hero"

const Herosection = () => {
    const [showAuthPopup, setShowAuthPopup] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [slides, setSlides] = useState([]); // Dynamic slides state
    const [showProductPopup, setShowProductPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false)
    const autoPlayRef = useRef(null);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true)



    const user = JSON.parse(localStorage.getItem('auth_user'));
    const userId = user?._id

    const handleStorageChange = () => {
        const updatedUser = JSON.parse(localStorage.getItem("auth_user"))
        setIsAuthenticated(!!updatedUser)
    }
    //check authenticate status on component mount
    useEffect(() => {
        handleStorageChange()
        window.addEventListener('storage', handleStorageChange);
        //Clean up 
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    const staticSlides = [
        {
            _id: 4,
            productname: "LAPTOP FOR THE FUTURE",
            description: "The new 18-inch bezel-less display offering a 4K resolution with smart screen features.",
            imageurl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            price: 1299.99,
            discount: 20,
            rating: 4,
            reviews: 30,
            category: "laptops",
            originalprice: 1500,
            status: "Active",
            stock: 50
        },
        {
            _id: 5,
            productname: "ULTRA-SLIM DESIGN",
            description: "Experience unparalleled performance with our thinnest and lightest laptop yet.",
            imageurl: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            price: 1499.99,
            discount: 26,
            rating: 4,
            reviews: 30,
            category: "laptops",
            originalprice: 1500,
            status: "Active",
            stock: 30
        },
        {
            _id: 6,
            productname: "POWERFUL PERFORMANCE",
            description: "Next-gen processors and advanced cooling system for seamless multitasking.",
            imageurl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            price: 1799.99,
            discount: 10,
            rating: 4,
            reviews: 30,
            category: "laptops",
            originalprice: 1500,
            status: "Active",
            stock: 20
        }
    ];

    const loadHeroProducts = async () => {
        try {

            const res = await axios.get(`${API_HERO}/`);

            if (res.data.success && res.data.data.length > 0) {
                const heroproduct = res.data.data
                const enhancedProducts = heroproduct.map(product => ({
                    ...product,
                    rating: product.rating || Math.floor(Math.random() * 5) + 1,
                    views: product.views || Math.floor(Math.random() * 1000) + 100,
                    likes: product.likes || Math.floor(Math.random() * 500) + 50,
                    reviews: product.reviews || Math.floor(Math.random() * 100) + 1,
                    inStock: product.stock > 0 || true
                }));
                setSlides(enhancedProducts);
                return;
            } else {
                // Final fallback: static data
                setSlides(staticSlides);
            }
        } catch (error) {
            console.error('Error loading hero products:', error);
            setSlides(staticSlides);
        }
    };

    // Check authentication status on component mount
    useEffect(() => {
        // Load hero products
        loadHeroProducts();
    }, [userId]);

    // Auth functions
    const handleLogin = () => {
        navigate('/auth/login');
        setShowAuthPopup(false);
    }

    const handleRegister = () => {
        navigate('/auth/register');
        setShowAuthPopup(false);
    }

    // Add to cart function
    const addToCart = async (product) => {
        // Get existing cart from localStorage
        try {
            const existingCart = await axios.post(`${API_CART}/add`, {
                userId: userId,
                productId: product._id,
                imageurl: product.imageurl,
                productname: product.productname,
                price: product.price,
                discount: product.discount,
                rating: product.rating,
                originalprice: product.originalprice,
                category: product.category,
            });
            setPopupMessage(`${product.productname} added successfully`)
            setShowPopup(true)
            // Show popup notification
            //alert("add to cart")
            console.log("added successfully")
            setTimeout(() => {
                setShowPopup(false)
            }, 2000);
        } catch (err) {
            console.log(err)
        }
    };

    const loadCart = async () => {
        try {
            const res = await axios.get(`${API_CART}/single/${userId}`)
            setSelectedProduct(res.data.data.cartlist)

        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        loadCart()
    }, [userId]
    )

    // Navigate to products page
    const goToProducts = () => {
        navigate('/product');
    };

    // Show product details popup
    const showProductDetails = (product) => {
        if (!isAuthenticated) {
            setShowAuthPopup(true);
            return;
        }
        setSelectedProduct(product);
        setShowProductPopup(true);
    };

    // Corrected button handlers
    const handleShopBtn = () => {
        if (!isAuthenticated) {
            setShowAuthPopup(true);
            return;
        }
        goToProducts();
        setIsOpen(false);
    }

    const handleOddCartBtn = () => {
        const currentProduct = slides[currentSlide];
        if (!currentProduct) return
        handlePopupAddToCart(true)
        addToCart(currentProduct)
    }

    // Add to cart from product popup
    const handlePopupAddToCart = (product) => {
        addToCart(product);
        setShowProductPopup(false);
    };

    // Auto-play functionality
    useEffect(() => {
        if (isAutoPlaying && slides.length > 0) {
            autoPlayRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
        }
        return () => {
            clearInterval(autoPlayRef.current);

        };
    }, [isAutoPlaying, slides]);

    const nextSlide = () => {
        if (slides.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            //resetAutoPlay();
        }
    };

    const prevSlide = () => {
        if (slides.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            resetAutoPlay();
        }
    };

    const goToSlide = (index) => {
        if (slides.length > 0) {
            setCurrentSlide(index);
            resetAutoPlay();
        }
    };

    const resetAutoPlay = () => {
        setIsAutoPlaying(false);
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const toggleAutoPlay = () => {
        setIsAutoPlaying(!isAutoPlaying);
    };

    // Get current product
    const currentProduct = slides[currentSlide] || {};


    // Show loading if no slides
    if (slides.length === 0) {
        return (
            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <LoaderIcon />
                    <p className="mt-4 text-gray-600">Loading featured products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">

            {/* Animated Background Circles with CSS Animations */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Circle 1 - Large Purple */}
                <div className="circle-animation circle-1 absolute w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-35 "></div>

                {/* Circle 2 - Medium Blue */}
                <div className="circle-animation circle-2 absolute w-80 h-80 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-25 "></div>

                {/* Circle 3 - Medium Green */}
                <div className="circle-animation circle-3 absolute w-72 h-72 bg-gradient-to-r from-green-200 to-blue-300 rounded-full opacity-30 "></div>

                {/* Circle 4 - Medium Orange */}
                <div className="circle-animation circle-4 absolute w-64 h-64 bg-gradient-to-r from-yellow-200 to-orange-300 rounded-full opacity-25 "></div>

                {/* Circle 5 - Small Pink */}
                <div className="circle-animation circle-5 absolute w-48 h-48 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full opacity-35 "></div>

                {/* Circle 6 - Small Teal */}
                <div className="circle-animation circle-6 absolute w-40 h-40 bg-gradient-to-r from-teal-300 to-blue-400 rounded-full opacity-30 "></div>

                {/* Circle 7 - Small Purple */}
                <div className="circle-animation circle-7 absolute w-32 h-32 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full opacity-40"></div>

                {/* Circle 8 - Extra Small Orange */}
                <div className="circle-animation circle-8 absolute w-24 h-24 bg-gradient-to-r from-orange-300 to-red-400 rounded-full opacity-35"></div>
            </div>

            {/* Subtle Animated Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/10 to-purple-50/20 pulse-overlay"></div>

            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                    {/* Text Content */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="pb-3 text-4xl md:text-5xl lg:text-6xl font-pop font-bold bg-gradient-to-r from-[#1600A0] to-[#9B77E7] bg-clip-text text-transparent">
                                {currentProduct.productname}
                            </h1>
                            <p className="pb-3 text-gray-600 max-w-md text-lg">
                                {currentProduct.description}
                            </p>
                            <div className="pb-2">
                                <span className="text-2xl font-bold text-[#1600A0]">
                                    ₹{currentProduct.price}
                                </span>
                                {currentProduct.originalprice && currentProduct.originalprice > currentProduct.price && (
                                    <span className="text-lg text-gray-500 line-through ml-2">
                                        ₹{currentProduct.originalprice}
                                    </span>
                                )}
                            </div>
                        </div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex space-x-6">
                                        <button
                                            onClick={handleShopBtn}
                                            className="px-8 py-4 border-2 border-black bg-transparent text-black rounded-lg font-medium hover:text-white hover:bg-gradient-to-r from-[#9B77E7] to-[#1600A0] transition-all duration-300 transform hover:scale-105"
                                        >
                                            Shop Now
                                        </button>
                                        <button
                                            onClick={handleOddCartBtn}
                                            className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#9B77E7] to-[#1600A0] text-white font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                        >
                                            Add To Cart
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Authentication Popup */}
                        <AnimatePresence>
                            {showAuthPopup && !isAuthenticated && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black bg-opacity-50 h-full w-full flex items-center justify-center z-50 p-4"
                                    onClick={() => setShowAuthPopup(false)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="bg-white relative rounded-lg p-6 max-w-md w-full "
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <X className="absolute top-3 right-3 cursor-pointer" onClick={() => setShowAuthPopup(false)} />
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                                            Authentication Required
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Please login or register to access this feature and view product details.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={handleLogin}
                                                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                                            >
                                                Login
                                            </button>
                                            <button
                                                onClick={handleRegister}
                                                className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                                            >
                                                Register
                                            </button>
                                            <button
                                                onClick={() => setShowAuthPopup(false)}
                                                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Product Details Popup */}
                        <AnimatePresence>
                            {showProductPopup && selectedProduct && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black bg-opacity-50 h-full w-full flex items-center justify-center z-70 p-4"
                                    onClick={() => setShowProductPopup(false)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="bg-white relative rounded-xl p-6 max-w-2xl w-full max-h-[90vh] mt-20 overflow-y-auto"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => setShowProductPopup(false)}
                                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                                        >
                                            <X size={24} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Product Image */}
                                            <div className="relative">
                                                <img
                                                    src={selectedProduct.imageurl}
                                                    alt={selectedProduct.productname}
                                                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                                                />
                                                {selectedProduct.discount > 0 && (
                                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        {selectedProduct.discount}% OFF
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="space-y-4">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.productname}</h2>
                                                    <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    <span className="text-3xl font-bold text-[#1600A0]">
                                                        ₹{selectedProduct.price}
                                                    </span>
                                                    {selectedProduct.originalprice && selectedProduct.originalprice > selectedProduct.price && (
                                                        <span className="text-xl text-gray-500 line-through">
                                                            ₹{selectedProduct.originalprice}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Rating and Reviews */}
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={16}
                                                                className={i < selectedProduct.rating
                                                                    ? "text-yellow-400 fill-current"
                                                                    : "text-gray-300"
                                                                }
                                                            />
                                                        ))}
                                                        <span className="text-sm text-gray-600 ml-1">
                                                            ({selectedProduct.rating})
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {selectedProduct.reviews} reviews
                                                    </span>
                                                </div>

                                                {/* Stats */}
                                                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
                                                    <div className="text-center">
                                                        <Eye size={20} className="mx-auto text-gray-500" />
                                                        <p className="text-sm font-medium text-gray-700">{selectedProduct.views}</p>
                                                        <p className="text-xs text-gray-500">Views</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <Heart size={20} className="mx-auto text-gray-500" />
                                                        <p className="text-sm font-medium text-gray-700">{selectedProduct.likes}</p>
                                                        <p className="text-xs text-gray-500">Likes</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <Share2 size={20} className="mx-auto text-gray-500" />
                                                        <p className="text-sm font-medium text-gray-700">Share</p>
                                                        <p className="text-xs text-gray-500">Product</p>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex space-x-3 pt-4">
                                                    <button
                                                        onClick={() => handlePopupAddToCart(selectedProduct)}
                                                        className="flex-1 bg-gradient-to-r from-[#9B77E7] to-[#1600A0] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 flex items-center justify-center"
                                                    >
                                                        <ShoppingCart size={20} className="mr-2" />
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        onClick={handleShopBtn}
                                                        className="flex-1 border-2 border-[#1600A0] text-[#1600A0] py-3 rounded-lg font-medium hover:bg-[#1600A0] hover:text-white transition-all duration-300"
                                                    >
                                                        View More
                                                    </button>
                                                </div>

                                                {/* Stock Status */}
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <CheckCircle size={16} className="text-green-500" />
                                                        <span className="text-sm text-green-700">
                                                            {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Slide Indicators */}
                        <div className="flex space-x-3 pt-8">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'bg-gradient-to-r from-[#9B77E7] to-[#1600A0] w-8'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Carousel Section */}
                    <div className="relative">
                        <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            {/* Main Carousel Image */}
                            <div
                                className="absolute inset-0 transition-transform duration-500 ease-in-out cursor-pointer"
                                onClick={() => showProductDetails(currentProduct)}
                            >
                                <img
                                    src={currentProduct.imageurl}
                                    alt={currentProduct.productname}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {currentProduct.discount}%
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                            </div>

                            {/* Carousel Controls */}
                            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 space-y-4 ">
                                <button
                                    onClick={prevSlide}
                                    className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center cursor-pointer justify-center hover:bg-white transition-all duration-300 shadow-lg transform hover:scale-110"
                                >
                                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </button>

                                <button
                                    onClick={nextSlide}
                                    className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full cursor-pointer flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg transform hover:scale-110"
                                >
                                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Auto-play Toggle */}
                                <button
                                    onClick={toggleAutoPlay}
                                    className={`w-12 h-12 backdrop-blur-sm rounded-full flex items-center cursor-pointer justify-center transition-all duration-300 shadow-lg transform hover:scale-110 ${isAutoPlaying ? 'bg-green-500/80 hover:bg-green-500' : 'bg-red-500/80 hover:bg-red-500'
                                        }`}
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {isAutoPlaying ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        )}
                                    </svg>
                                </button>
                            </div>

                            {/* Slide Counter */}
                            <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                                <span className="font-medium">{currentSlide + 1}</span>
                                <span className="text-gray-300"> / {slides.length}</span>
                            </div>
                        </div>

                        {showPopup && (
                            <SuccessPopup title={popupMessage} bgcolor="success" />
                        )
                        }

                        {/* Thumbnail Previews */}
                        <div className="flex space-x-4 mt-6 justify-center">
                            {slides.map((slide, index) => (
                                <button
                                    key={slide._id}
                                    onClick={() => goToSlide(index)}
                                    className={`w-20 h-16 rounded-lg overflow-hidden transition-all duration-300 transform ${index === currentSlide
                                        ? 'ring-4 ring-[#9B77E7] scale-110'
                                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                                        }`}
                                >
                                    <img
                                        src={slide.imageurl}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Herosection;