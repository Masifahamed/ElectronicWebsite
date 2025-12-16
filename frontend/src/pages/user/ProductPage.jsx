import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Heart, Star, Search, Filter, X, ShoppingCart, Plus, Minus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SuccessPopup from '../../components/user/SuccessPopup'
import { backend } from "../../ultis/constant";



const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const urlQuery = new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  const user = JSON.parse(localStorage.getItem("auth_user"))
  const userId = user?._id

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [likeMap, setLikedMap] = useState({})
  const [cart, setCart] = useState([])
  const [likedProducts, setLikedProducts] = useState({});

  useEffect(() => {
    if (!userId) return;

    const loadWishlist = async () => {
      try {
        const res = await fetch(`${backend}/api/wishlist/single/${userId}`);
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
    };

    loadWishlist();
  }, [userId]);

  // Filter states
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    minDiscount: "",
    category: "",
    inStock: false
  });

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // Popup states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [successmessage, setsuccessmessage] = useState('')
  const [showpopup, setShowpopup] = useState(false)

  useEffect(() => {
    const fetchallproduct = async () => {
      const productdata = await fetch(`${backend}/api/product`)
      const { data } = await productdata.json()
      const fixedProducts = data.map(p => ({
        ...p,
        _id: p._id || p.id,
        imageurl: p.imageurl || p.image,
        originalprice: p.originalprice || p.originalPrice,
        rating: p.rating && p.rating <= 5 ? p.rating : Math.floor(Math.random() * 5) + 1,
        views: p.views || Math.floor(Math.random() * 1000) + 10,
        likes: p.likes || Math.floor(Math.random() * 500) + 50,
        reviews: p.reviews || Math.floor(Math.random() * 100) + 1,
        inStock: p.stock > 0 || true
      }))
      // console.log(data)
      setProducts(fixedProducts)
    }
    fetchallproduct();
  }, [])
  // Real-time search and filter
  useEffect(() => {
    let filtered = products;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.productname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseInt(filters.maxPrice));
    }
    if (filters.minRating) {
      filtered = filtered.filter(product => product.rating >= parseFloat(filters.minRating));
    }
    if (filters.minDiscount) {
      filtered = filtered.filter(product => product.discount >= parseInt(filters.minDiscount));
    }
    if (filters.category) {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    setFilteredProducts(filtered);
    updateActiveFilters();
  }, [searchQuery, filters, products]);

  // Update active filters for display
  const updateActiveFilters = () => {
    const active = [];
    if (filters.minPrice) active.push(`Min Price: ₹${filters.minPrice}`);
    if (filters.maxPrice) active.push(`Max Price: ₹${filters.maxPrice}`);
    if (filters.minRating) active.push(`Min Rating: ${filters.minRating}+`);
    if (filters.minDiscount) active.push(`Min Discount: ${filters.minDiscount}%+`);
    if (filters.category) active.push(`Category: ${filters.category}`);
    if (filters.inStock) active.push('In Stock Only');

    setActiveFilters(active);
  };

  // Sync with URL when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
    } else {
      navigate('/product', { replace: true });
    }
  }, [searchQuery, navigate]);

  // Handle product card click
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    const cartItem = cart.find((item) => item.productId === product._id)
    if (cartItem) {
      setQuantity(cartItem.quantity)
    } else {
      setQuantity(1);
    }
    setShowProductPopup(true);
  };


  // Handle add to cart from popup
  const handleAddToCart = async (product) => {
    try {
      //const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Check if product already exists in cart
      const res = await axios.post(`${backend}/api/cart/add`, {
        userId: userId,
        productId: product._id,
        imageurl: product.imageurl,
        productname: product.productname,
        price: product.price,
        discount: product.discount,
        rating: product.rating,
        originalprice: product.originalprice,
        category: product.category,
        quantity: quantity

      })
      //console.log(res.data.message)

      // Show success message
      setShowCartMessage(true);

      // Close popup after adding to cart
      setShowProductPopup(false);
      // Auto hide message after 3 seconds
      setTimeout(() => {
        setShowCartMessage(false);
      }, 3000);


    } catch (err) {
      console.log(err)

    }
  };

  const loadCart = async () => {
    try {
      const res = await axios.get(`${backend}/api/cart/single/${userId}`)
      setCart(res.data.data.cartlist);
      setLoading(false)
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  }
  useEffect(() => {
    loadCart()
  }, [userId])

  // Handle quantity changes
  // const increaseQuantity = async (productId) => {
  //   const newQty = quantity + 1
  //   setQuantity(newQty)
  //   await axios.post(`http://localhost:3500/api/cart/increase`, {
  //     userId,
  //     productId,
  //     quantity: newQty
  //   })
  //   loadCart()
  //   //setQuantity(prev => prev + 1);
  // };
  const increaseQuantity = async (productId) => {
    setQuantity(prev => {
      const newQty = prev + 1
      axios.post(`${backend}/api/cart/increase`, {
        productId,
        userId,
        quantity: newQty
      })
      return newQty
    })
    loadCart()
  }

  // const decreaseQuantity = async (productId, quantity) => {
  //   if (quantity <= 1) return

  //   const newQty = quantity - 1
  //   setQuantity(newQty)

  //   await axios.post(`http://localhost:3500/api/cart/decrease`, {
  //     userId,
  //     productId,
  //     quantity: newQty
  //   })
  //   loadCart()
  //   //setQuantity(prev => prev > 1 ? prev - 1 : 1);
  // };

  const decreaseQuantity = async (productId) => {
    setQuantity(prev => {
      const newQty = prev - 1
      axios.post(`${backend}/api/cart/decrease`, {
        userId,
        productId,
        quantity: newQty
      })
      return newQty
    })
    loadCart()
  }
// const decrease=()=>{
// setQuantity(prev=> prev-1)
// }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      minRating: "",
      minDiscount: "",
      category: "",
      inStock: false
    });
  };

  // Remove specific filter
  const removeFilter = (filterToRemove) => {
    if (filterToRemove.startsWith('Min Price:')) {
      setFilters(prev => ({ ...prev, minPrice: "" }));
    } else if (filterToRemove.startsWith('Max Price:')) {
      setFilters(prev => ({ ...prev, maxPrice: "" }));
    } else if (filterToRemove.startsWith('Min Rating:')) {
      setFilters(prev => ({ ...prev, minRating: "" }));
    } else if (filterToRemove.startsWith('Min Discount:')) {
      setFilters(prev => ({ ...prev, minDiscount: "" }));
    } else if (filterToRemove.startsWith('Category:')) {
      setFilters(prev => ({ ...prev, category: "" }));
    } else if (filterToRemove === 'In Stock Only') {
      setFilters(prev => ({ ...prev, inStock: false }));
    }
  };

  const toggleLike = async (product) => {
    //e.stopPropagation();  // stop card click


    if (!userId) {
      setsuccessmessage("Please login to use wishlist");
      setShowpopup(true);
      setTimeout(() => setShowpopup(false), 2000);
      return;
    }
    try {
      const productId = product._id;
      const isLiked = likedProducts[productId];

      if (!isLiked) {
        await axios.post(
          `${backend}/api/wishlist/add`, {
          userId,
          productId,
          imageurl: product.imageurl,
          productname: product.productname,
          price: product.price,
          discount: product.discount,
          originalprice: product.originalprice,
          category: product.category,
          rating: product.rating && product.rating < 5 ? product.rating : Math.floor(Math.random() * 5) + 1,
          stock: product.stock,
          description: product.description
        }
        );

        // update UI
        setLikedProducts(prev => ({
          ...prev,
          [productId]: true
        }));

        setsuccessmessage("Added to wishlist")
      } else {

        await axios.delete(`${backend}/api/wishlist/remove/${userId}/${productId}`);

        setsuccessmessage("remove from wishlist")
        // update UI
        setLikedProducts(prev => {

          const newState = { ...prev };
          delete newState[productId];
          return newState;

        });

      }

      setShowpopup(true);
      setTimeout(() => setShowpopup(false), 2000);
    } catch (err) {
      console.log("Wishlist error:", err);
      setsuccessmessage("Wishlist error");
      setShowpopup(true);
      setTimeout(() => setShowpopup(false), 2000);
    }
  };

  // // Get unique categories for dropdown
  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-12">
      {/* Header */}
      <h1 className="text-center mb-10 text-[30px] font-bold uppercase bg-gradient-to-r from-[#1600A0] to-[#9B77E7]  bg-clip-text text-transparent">Browse your product </h1>
      <div className="flex flex-col lg:flex-row items-center justify-center items-start lg:items-center lg:align-center gap-6 mb-8">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row lg:gap-200 md:gap-10 sm:gap-10 sm:items-center">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-xl hover:shadow-xl transition-all duration-300"
          >
            <Filter className="w-5 h-5" />
            Filters
            {activeFilters.length > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
          {showpopup && (
            <SuccessPopup title={successmessage} bgcolor="success" />
          )}
          {/* Search bar */}
          <div className="flex justify-center mt-10">
            <div className="w-60 relative">
              <form onSubmit={handleSearch} className='flex items-center bg-gray-100 rounded-full px-3 py-1'>
                <input
                  type="text"
                  placeholder='Search Products...'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='bg-transparent outline-none px-2 text-gray-700 w-[180px] md:w-[200px]'
                />
                <button type="submit">
                  <Search className='text-gray-500 w-5 h-5 hover:text-blue-500 transition' />
                </button>
              </form>

              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <span
              key={index}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="hover:text-blue-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Price Range */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full outline-none border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full outline-none border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Minimum Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              className="w-full outline-none border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>

          {/* Discount */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Minimum Discount</label>
            <select
              value={filters.minDiscount}
              onChange={(e) => handleFilterChange('minDiscount', e.target.value)}
              className="w-full outline-none border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Any Discount</option>
              <option value="10">10%+ Off</option>
              <option value="20">20%+ Off</option>
              <option value="30">30%+ Off</option>
              <option value="40">40%+ Off</option>
              <option value="50">50%+ Off</option>
            </select>
          </div>

          {/* Category & Stock */}
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full outline-none border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

          </div>
        </motion.div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-15 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center gap-y-10">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              className="flex-none w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleProductClick(product)}
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.imageurl}
                  alt={product.productname}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.discount}%
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLike(product) }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm cursor-pointer rounded-full flex items-center justify-center hover:bg-white transition-all duration-300"
                >
                  <Heart
                    className={`w-5 h-5 ${likedProducts[product._id]
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-600'
                      }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                  {product.productname}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="text-lg font-bold text-gray-500 line-through ml-2">
                    ₹{product.originalprice}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {product.views} views
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {product.likes} likes
                  </div>
                </div>

                {/* Add To Cart Button */}
                <button
                  className="w-full mt-4 bg-gradient-to-r from-[#9B77E7] to-[#1600A0] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-12">
          <p>No products found matching your criteria 😔</p>
          {(searchQuery || activeFilters.length > 0) && (
            <button
              onClick={() => {
                clearSearch();
                clearAllFilters();
              }}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Product Details Popup */}
      <AnimatePresence>
        {showProductPopup && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
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
              <div className="grid md:grid-cols-2 gap-8 p-6">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={selectedProduct.imageurl}
                    alt={selectedProduct.productname}
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedProduct.discount}% OFF
                  </div>
                  <button
                    onClick={() => setShowProductPopup(false)}
                    className="absolute top-0 right-0 w-8 h-8 bg-gray-200 rounded-full flex items-center cursor-pointer justify-center hover:bg-gray-300 transition-all duration-300"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div className="relative">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {selectedProduct.productname}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {selectedProduct.description || "Premium quality product with excellent features and performance."}
                    </p>

                  </div>



                  {/* Price */}
                  <div className="space-y-2">
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

                  {/* Quantity Selector */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => decreaseQuantity(selectedProduct._id)}
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

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => handleAddToCart(selectedProduct)}
                      className="flex-1 bg-gradient-to-r from-[#9B77E7] to-[#1600A0] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart - ₹{selectedProduct.price * quantity}</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(), toggleLike(selectedProduct, e) }}
                      className="w-14 h-14 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                      aria-label={likedProducts[selectedProduct.id || selectedProduct._id] ? "remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        className={`w-6 h-6 ${likedProducts[selectedProduct._id]
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-400'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Category:</span> {selectedProduct.category || "Electronics"}
                      </div>
                      <div>
                        <span className="font-semibold">Views:</span> {selectedProduct.views}
                      </div>
                      <div>
                        <span className="font-semibold">Likes:</span> {selectedProduct.likes}
                      </div>
                      <div>
                        <span className="font-semibold">In Stock:</span> {selectedProduct.inStock ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Success Message */}
      <AnimatePresence>
        {showCartMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5" />
              <div>
                <p className="font-semibold">Product added to cart!</p>
                <p className="text-sm opacity-90">
                  <button
                    onClick={() => navigate('/order')}
                    className="underline hover:no-underline"
                  >
                    View cart
                  </button> to proceed to checkout
                </p>
              </div>
              <button
                onClick={() => setShowCartMessage(false)}
                className="text-white hover:text-gray-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;