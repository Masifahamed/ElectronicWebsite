// src/hooks/useProducts.js
import { useEffect, useMemo, useState } from "react";
import axios from "axios";


const API_BASE =  process.env.REACT_APP_API_URL||"http://localhost:3500";
export default function useProducts() {
    
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    minDiscount: "",
    category: "",
    inStock: false,
  });

  // wishlist & likes
  const [wishlist, setWishlist] = useState([]);
  const [likedMap, setLikedMap] = useState({});

  // Popup
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products from API (fallback localStorage)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/product`);
      const data = res.data?.data || res.data || [];
      const fixed = data.map((p) => ({
        ...p,
        _id: p._id || p.id,
        imageurl: p.imageurl || p.image || p.imageUrl,
        originalprice: p.originalprice ?? p.originalPrice ?? p.mrp ?? p.price,
        inStock: (p.stock ?? 1) > 0,
        rating: p.rating ?? 4.5,
        views: p.views ?? Math.floor(Math.random() * 1000) + 50,
        likes: p.likes ?? Math.floor(Math.random() * 500) + 10,
        reviews: p.reviews ?? Math.floor(Math.random() * 200) + 1,
      }));
      setProducts(fixed);
      setLoading(false);
    } catch (err) {
      // fallback: localStorage adminProducts
      const stored = localStorage.getItem("adminProducts");
      if (stored) {
        const parsed = JSON.parse(stored).filter((p) => p.status === "Active");
        setProducts(parsed);
      } else {
        setProducts([]);
      }
      setLoading(false);
    }
  };

  // Fetch wishlist for logged-in user
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;

      const res = await axios.get(`${API_BASE}/api/wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // res.data.data expected to be wishlist doc from backend
      const productsArr = res.data?.data?.products ?? [];
      // If backend populated productId, map to product objects; else store productId only
      const formatted = productsArr.map((p) =>
        p.productId && typeof p.productId === "object"
          ? { ...p.productId, addedDate: p.addedDate }
          : { _id: p.productId, addedDate: p.addedDate }
      );
      setWishlist(formatted);

      // Build liked map
      const map = {};
      formatted.forEach((it) => {
        const id = it._id || it.productId;
        if (id) map[id] = true;
      });
      setLikedMap(map);
    } catch (err) {
      console.error("fetchWishlist:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
    // eslint-disable-next-line
  }, []);

  // derived filtered list, memoized
  const filtered = useMemo(() => {
    let out = products.slice();
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      out = out.filter((p) => (p.productname || p.name || "").toLowerCase().includes(q));
    }
    if (filters.minPrice) out = out.filter((p) => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) out = out.filter((p) => p.price <= Number(filters.maxPrice));
    if (filters.minRating) out = out.filter((p) => p.rating >= Number(filters.minRating));
    if (filters.minDiscount) out = out.filter((p) => (p.discount ?? 0) >= Number(filters.minDiscount));
    if (filters.category) out = out.filter((p) => (p.category || "").toLowerCase().includes((filters.category || "").toLowerCase()));
    if (filters.inStock) out = out.filter((p) => p.inStock);
    return out;
  }, [products, searchQuery, filters]);

  // Add to cart (localStorage)
  const addToCart = (product, quantity = 1) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex((c) => c._id === product._id);
    if (idx >= 0) cart[idx].quantity += quantity;
    else cart.push({ ...product, quantity, addedDate: new Date().toISOString() });
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // Toggle wishlist -> call backend add/remove
  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      return { ok: false, message: "Login required" };
    }

    const isLiked = !!likedMap[productId];

    try {
      if (!isLiked) {
        // add
        await axios.post(
          `${API_BASE}/api/wishlist/add`,
          { userId, productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // find product in products to push local copy
        const product = products.find((p) => p._id === productId) || { _id: productId };
        const newItem = { ...product, addedDate: new Date().toISOString() };
        setWishlist((s) => [...s, newItem]);
        setLikedMap((m) => ({ ...m, [productId]: true }));
      } else {
        // remove
        await axios.delete(`${API_BASE}/api/wishlist/delete`, {
          data: { userId, productId },
          headers: { Authorization: `Bearer ${token}` },
        });

        setWishlist((s) => s.filter((it) => (it._id || it.productId) !== productId));
        setLikedMap((m) => {
          const copy = { ...m };
          delete copy[productId];
          return copy;
        });
      }

      // sync localStorage (optional)
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      return { ok: true };
    } catch (err) {
      console.error("toggleWishlist:", err?.response?.data || err.message);
      return { ok: false, message: err?.response?.data?.message || err.message };
    }
  };

  return {
    products,
    loading,
    filtered,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    addToCart,
    selectedProduct,
    setSelectedProduct,
    setFilters,
    wishlist,
    likedMap,
    toggleWishlist,
    fetchWishlist,
  };
}
