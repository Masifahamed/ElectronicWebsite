// src/components/ProductPopup.jsx
import React from "react";
import { motion } from "framer-motion";
import { X, Plus, Minus, ShoppingCart, Heart } from "lucide-react";

export default function ProductPopup({ product, onClose, quantity, setQuantity, onAddToCart, onToggleLike, isLiked }) {
  if (!product) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="relative">
            <img src={product.imageurl} alt={product.productname} className="w-full h-96 object-cover rounded-2xl" />
            <div className="absolute top-4 right-4">
              <button onClick={onClose} className="bg-gray-100 p-2 rounded-full"><X /></button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{product.productname}</h2>
            <p className="text-gray-600">{product.description || "Great product."}</p>

            <div className="text-3xl font-bold">₹{product.price} <span className="text-lg line-through text-gray-500 ml-2">₹{product.originalprice}</span></div>
            <p className="text-green-600">You save ₹{(product.originalprice || product.price) - product.price} ({product.discount}% OFF)</p>

            <div>
              <label className="block text-sm">Quantity</label>
              <div className="flex items-center gap-4 mt-2">
                <button onClick={()=> setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 rounded-full border"> <Minus /></button>
                <div className="text-xl font-semibold w-8 text-center">{quantity}</div>
                <button onClick={()=> setQuantity(q => q+1)} className="w-10 h-10 rounded-full border"><Plus /></button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => onAddToCart(product, quantity)} className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"><ShoppingCart /> Add to Cart</button>
              <button onClick={() => onToggleLike(product._id)} className="w-14 bg-gray-100 rounded-lg flex items-center justify-center"><Heart className={`${isLiked ? "text-red-500 fill-red-500" : "text-gray-600"}`} /></button>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div><strong>Category:</strong> {product.category}</div>
                <div><strong>Views:</strong> {product.views}</div>
                <div><strong>Likes:</strong> {product.likes}</div>
                <div><strong>In Stock:</strong> {product.inStock ? "Yes" : "No"}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
