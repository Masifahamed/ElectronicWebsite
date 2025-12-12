import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, Share2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/WithAuth";
import axios from "axios";
import SuccessPopup from '../../components/user/SuccessPopup'

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [sortBy, setSortBy] = useState("dateAdded");
  const navigate = useNavigate();
  const [Message, setMessage] = useState("")
  const [popup, setPopup] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const user = JSON.parse(localStorage.getItem('auth_user'))
  const userId = user?._id

  // const { user } = useAuth()
  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3500/api/wishlist/single/${userId}`);
      //setWishlistItems(res.data.data.product)

      if (res.data?.data?.product) {
        const formatted = res.data.data.product.map((p) => ({
          ...p, // getting product details
          rating: p.rating && p.rating <= 5 ? p.rating : Math.floor(Math.random() * 5) + 1,
          views: p.views || Math.floor(Math.random() * 1000) + 10,
          likes: p.likes || Math.floor(Math.random() * 500) + 50,
          reviews: p.reviews || Math.floor(Math.random() * 100) + 1,
          addedDate: p.addedDate,
        }));
        setWishlistItems(formatted);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };
  useEffect(() => {
    fetchWishlist()
  }, [])

  // Remove item
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:3500/api/wishlist/remove/${userId}/${productId}`);
      setMessage("Product remove from wishlist")
      setPopup(true)
      setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
      setTimeout(() => {
        setPopup(false)
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  // Move item to cart
  const moveToCart = async (product) => {
    try {

      const res = await axios.post("http://localhost:3500/api/cart/add", {
        userId: userId,
        productId: product._id,
        imageurl: product.imageurl,
        productname: product.productname,
        price: product.price,
        discount: product.discount,
        rating: product.rating,
        originalprice:product.originalprice,
        category: product.category,
        quantity: 1
      })
      //console.log(res.data.message)
      // Here you would typically add to cart
      //console.log("Moving to cart:", product);
      //alert(`${product.productname} added to cart!`);
      setMessage(`${product.productname} added to cart`)
      setPopup(true)
      setSelectedProduct(false)
      setTimeout(() => {
        setPopup(false)
      }, 2000);
      removeFromWishlist(product);
      // setshowPopup(false)
    } catch (err) {
      console.log(err)
    }
  }

  // Share wishlist
  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: 'Check out my wishlist!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Wishlist link copied to clipboard!');
    }
  };

  // Sort wishlist items
  const getSortedWishlist = () => {
    const sorted = [...wishlistItems];
    switch (sortBy) {
      case "priceLowHigh":
        return sorted.sort((a, b) => a.price - b.price);
      case "priceHighLow":
        return sorted.sort((a, b) => b.price - a.price);
      case "name":
        return sorted.sort((a, b) => a.productname.localeCompare(b.productname));
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "dateAdded":
      default:
        return sorted.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
    }
  };

  const sortedWishlist = getSortedWishlist();

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 md:px-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent mb-3">
          My Wishlist
        </h1>
        <p className="text-gray-600 text-lg">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
        </p>
        {/* Quick Stats */}
        {wishlistItems.length > 0 && (
          <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {wishlistItems.length}
              </div>
              <div className="text-gray-600">Total Items</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                ₹{wishlistItems.reduce((total, item) => total + item.price, 0)}
              </div>
              <div className="text-gray-600">Total Value</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">
                ₹{wishlistItems.reduce((total, item) => total + (item.originalprice - item.price), 0)}
              </div>
              <div className="text-gray-600">Total Savings</div>
            </div>
          </div>
        )}

      </div>

      {/* Wishlist Controls */}
      {wishlistItems.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dateAdded">Recently Added</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={shareWishlist}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Wishlist</span>
            </button>
          </div>
        </div>
      )}

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <div className="max-w-7xl ms-2 me-5">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center">
            {sortedWishlist.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl ms-10 transition-all duration-300 transform hover:translate-y-2"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.imageurl}
                    alt={product.productname}
                    className="w-full h-48 object-cover rounded-t-2xl cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowPopup(true)
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.discount}% OFF
                  </div>
                  <button
                    onClick={() => removeFromWishlist(product.productId)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm  rounded-full flex items-center justify-center hover:bg-white transition-all duration-300"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </button>

                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.productname}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                            }`}
                        >
                          ★
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through ml-2">
                      ₹{product.originalprice}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-600 border-t border-gray-100 pt-3 mb-4">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {product.views} views
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {product.likes} likes
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => moveToCart(product)}
                      className="flex-1 bg-gradient-to-r from-blue-700 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.productId)}
                      className="w-12 bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Added Date */}
                  <div className="text-xs text-gray-500 text-center mt-3">
                    Added on {new Date(product.addedDate).toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty Wishlist State */
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-16 h-16 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start exploring our products and add items you love to your wishlist for easy access later.
          </p>
          <button
            onClick={() => navigate('/product')}
            className="bg-gradient-to-r from-blue-700 to-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            Start Shopping
          </button>
        </div>
      )}

      {showPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl cursor-pointer"
            >
              ✕
            </button>

            <img src={selectedProduct.imageurl} alt={selectedProduct.productname} className="rounded-xl w-full h-64 object-cover" />

            <h2 className="text-2xl font-bold mt-4">{selectedProduct.productname}</h2>
            <p className="mt-2 text-gray-600">{selectedProduct.description}</p>

            <div className="flex items-center mt-3 gap-4">
              <span className="text-2xl font-bold text-gray-900">₹{selectedProduct.price}</span>
              <span className="text-lg text-gray-500 line-through">₹{selectedProduct.originalprice}</span>
            </div>

            <button
              onClick={() => moveToCart(selectedProduct)}
              className="w-full bg-gradient-to-r from-blue-700 to-indigo-500 text-white py-3 mt-5 rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
      {
        popup && (
          <SuccessPopup title={Message} bgcolor="success"/>
        )
      }

    </div>
  );
};

export default WishlistPage;