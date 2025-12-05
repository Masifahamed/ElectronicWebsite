// src/components/ProductCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Eye, Heart, Star, ShoppingCart } from "lucide-react";

export default function ProductCard({ product, onOpen, onToggleLike, isLiked, onAddToCart }) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03 }}
      className="flex-none w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-2 cursor-pointer"
      onClick={() => onOpen(product)}
    >
      <div className="relative">
        <img src={product.imageurl} alt={product.productname} className="w-full h-48 object-cover rounded-t-2xl" />
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {product.discount ?? 0}% OFF
        </div>

        <button onClick={(e)=>{ e.stopPropagation(); onToggleLike(product._id); }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all">
          <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{product.productname}</h3>

        <div className="flex items-center mb-2 text-yellow-500">
          <Star className="w-4 h-4 mr-1" /> {product.rating} <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
        </div>

        <div className="text-2xl font-bold mb-3">₹{product.price} <span className="text-gray-500 line-through text-lg ml-2">₹{product.originalprice}</span></div>

        <div className="flex justify-between text-sm text-gray-600 border-t pt-3">
          <div className="flex items-center"><Eye className="w-4 h-4 mr-1" /> {product.views} views</div>
          <div className="flex items-center"><Heart className="w-4 h-4 mr-1" /> {product.likes} likes</div>
        </div>

        <button onClick={(e)=>{ e.stopPropagation(); onAddToCart(product); }} className="w-full mt-4 bg-gradient-to-r from-[#9B77E7] to-[#1600A0] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">Add to Cart</button>
      </div>
    </motion.div>
  );
}
