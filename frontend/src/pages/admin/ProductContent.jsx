import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Star, RefreshCw } from 'lucide-react';
import { backend } from '../../ultis/constant';

const API = `${backend}/api/product`; // backend base URL

const ProductsContent = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const[loading,setLoading]=useState(true)
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    productname: '',
    price: '',
    discount: '',
    originalprice: '',
    category: '',
    stock: '',
    description: '',
    imageurl: ''
  });

  const categoryname=["Laptop","Phone","HeadPhone","Speaker","Gaming","Smart Watch","Camera"]

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get(API);
      // backend sometimes returns { count, data } or directly an array/object
      const data = res.data?.data ?? res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    }finally{
      setLoading(false)
    }
  };

  // const calculatingRating = (productId) => {
  //   const productReviews = JSON.parse(localStorage.getItem(`productReviews_${productId}`) || '[]');
  //   if (productReviews.length === 0) return 0;
  //   const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
  //   return parseFloat((totalRating / productReviews.length).toFixed(1));
  // };

  // const getReviewCount = (productId) => {
  //   const productReviews = JSON.parse(localStorage.getItem(`productReviews_${productId}`) || '[]');
  //   return productReviews.length;
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        productname: productForm.productname,
        price: productForm.price,
        discount: Number(productForm.discount) || 0,
        originalprice: productForm.originalprice
          ? Number(productForm.originalprice)
          : Number(productForm.price),
        category: productForm.category,
        stock: Number(productForm.stock),
        description: productForm.description,
        imageurl: productForm.imageurl
      };

      const res = await axios.post(API, payload);
      const created = res.data?.data ?? res.data; // handle different backend shapes
      // If backend returns { count, data } for POST it would be odd; typically res.data is the created doc.
      setProducts((prev) => [...prev, created]);
      resetForm();
      alert('Product added successfully!');
    } catch (err) {
      console.error('Add product failed:', err);
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setProductForm({
      productname: product.productname || '',
      price: product.price ?? '',
      discount: product.discount ?? '',
      originalprice: product.originalprice ?? product.price ?? '',
      category: product.category || '',
      stock: product.stock ?? '',
      description: product.description || '',
      imageurl: product.imageurl || ''
    });
    setIsEditing(true);
    setShowProductForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    try {
      const payload = {
        productname: productForm.productname,
        price: Number(productForm.price),
        discount: Number(productForm.discount) || 0,
        originalprice: productForm.originalprice
          ? Number(productForm.originalprice)
          : Number(productForm.price),
        category: productForm.category,
        stock: Number(productForm.stock),
        description: productForm.description,
        imageurl: productForm.imageurl
      };

      const res = await axios.put(`${API}/${currentProduct._id}`, payload);
      const updated = res.data?.data ?? res.data;

      setProducts((prev) => prev.map((p) => (p._id === currentProduct._id ? updated : p)));
      resetForm();
      alert('Product updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API}/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setShowProductForm(false);
    setProductForm({
      productname: '',
      price: '',
      discount: '',
      originalprice: '',
      category: '',
      stock: '',
      description: '',
      imageurl: ''
    });
  };

  const handleAddButtonClick = () => {
    resetForm();
    setShowProductForm(true);
  };

  // const refreshProductRating = () => {
  //   const updatedProducts = products.map((product) => ({
  //     ...product,
  //     rating: calculatingRating(product._id),
  //     reviews: getReviewCount(product._id)
  //   })); 
  //   setProducts(updatedProducts);
  //   window.confirm('Rating refreshed');
  // };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Management</h2>
          <p className="text-gray-600">Manage your product inventory and listings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddButtonClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </button>
        </div>
        <button
            onClick={loadProducts}
            className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2"
          ><RefreshCw className='w-4 h-4'/>
            Refresh 
          </button>
      </div>

      {showProductForm && (
        <div className="bg-white rounded-lg shadow-sm flex-col justify-center p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="productname"
                  value={productForm.productname}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={productForm.discount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                <input
                  type="number"
                  name="originalprice"
                  value={productForm.originalprice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
               
                <select name="category" value={productForm.category} required onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {categoryname.map(category=>(
                  <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={productForm.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border resize-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  name="imageurl"
                  value={productForm.imageurl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">All Products ({products.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.imageurl}
                        alt={product.productname}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.productname}</div>
                        <div className="text-sm text-gray-500">₹{product.price}

                 </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{product.originalprice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{product.price}
                    {product.discount > 0 && (
                      <span className="text-green-600 text-xs ml-1">({product.discount}% OFF)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating > 0 ? product.rating : 'No ratings'} ({product.reviews ?? 0})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.status ?? 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-900 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-900 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsContent;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Plus, Edit, Trash2, Star, Search, Filter, X, TrendingUp, Zap } from 'lucide-react';

// const API = 'http://localhost:3500/api/product';

// const ProductsContent = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [showProductForm, setShowProductForm] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [sortBy, setSortBy] = useState('name');
//   const [loading, setLoading] = useState(false);

//   const productForm = {
//     productname: '',
//     price: '',
//     discount: '',
//     originalprice: '',
//     category: '',
//     stock: '',
//     description: '',
//     imageurl: ''
//   };

//   const [formData, setFormData] = useState(productForm);

//   const categories = [
//     "Laptop", "Phone", "HeadPhone", "Speaker", 
//     "Gaming", "Smart Watch", "Camera", "Tablet", "Accessories"
//   ];

//   const statusColors = {
//     Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
//     Inactive: 'bg-gray-50 text-gray-700 border-gray-200',
//     'Low Stock': 'bg-amber-50 text-amber-700 border-amber-200',
//     'Out of Stock': 'bg-red-50 text-red-700 border-red-200'
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   useEffect(() => {
//     filterAndSortProducts();
//   }, [products, searchTerm, selectedCategory, sortBy]);

//   const loadProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(API);
//       const data = res.data?.data ?? res.data;
//       const productsWithDetails = Array.isArray(data) ? data.map(product => ({
//         ...product,
//         rating: calculatingRating(product._id),
//         reviews: getReviewCount(product._id),
//         status: getProductStatus(product.stock)
//       })) : [];
//       setProducts(productsWithDetails);
//     } catch (err) {
//       console.error('Failed to load products:', err);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getProductStatus = (stock) => {
//     if (stock === 0) return 'Out of Stock';
//     if (stock <= 10) return 'Low Stock';
//     return 'Active';
//   };

//   const filterAndSortProducts = () => {
//     let filtered = products.filter(product => {
//       const matchesSearch = product.productname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            product.category?.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
//       return matchesSearch && matchesCategory;
//     });

//     // Sort products
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'name':
//           return a.productname?.localeCompare(b.productname);
//         case 'price-high':
//           return b.price - a.price;
//         case 'price-low':
//           return a.price - b.price;
//         case 'rating':
//           return (b.rating || 0) - (a.rating || 0);
//         case 'stock':
//           return b.stock - a.stock;
//         default:
//           return 0;
//       }
//     });

//     setFilteredProducts(filtered);
//   };

//   const calculatingRating = (productId) => {
//     const productReviews = JSON.parse(localStorage.getItem(`productReviews_${productId}`) || '[]');
//     if (productReviews.length === 0) return 0;
//     const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
//     return parseFloat((totalRating / productReviews.length).toFixed(1));
//   };

//   const getReviewCount = (productId) => {
//     const productReviews = JSON.parse(localStorage.getItem(`productReviews_${productId}`) || '[]');
//     return productReviews.length;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = {
//         ...formData,
//         price: Number(formData.price),
//         discount: Number(formData.discount) || 0,
//         originalprice: formData.originalprice ? Number(formData.originalprice) : Number(formData.price),
//         stock: Number(formData.stock)
//       };

//       const res = await axios.post(API, payload);
//       const created = res.data?.data ?? res.data;
      
//       setProducts(prev => [...prev, {
//         ...created,
//         rating: 0,
//         reviews: 0,
//         status: getProductStatus(created.stock)
//       }]);
      
//       resetForm();
//       alert('Product added successfully! 🎉');
//     } catch (err) {
//       console.error('Add product failed:', err);
//       alert(err.response?.data?.message || 'Failed to add product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditProduct = (product) => {
//     setCurrentProduct(product);
//     setFormData({
//       productname: product.productname || '',
//       price: product.price ?? '',
//       discount: product.discount ?? '',
//       originalprice: product.originalprice ?? product.price ?? '',
//       category: product.category || '',
//       stock: product.stock ?? '',
//       description: product.description || '',
//       imageurl: product.imageurl || ''
//     });
//     setIsEditing(true);
//     setShowProductForm(true);
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     if (!currentProduct) return;
//     setLoading(true);

//     try {
//       const payload = {
//         ...formData,
//         price: Number(formData.price),
//         discount: Number(formData.discount) || 0,
//         originalprice: formData.originalprice ? Number(formData.originalprice) : Number(formData.price),
//         stock: Number(formData.stock)
//       };

//       const res = await axios.put(`${API}/${currentProduct._id}`, payload);
//       const updated = res.data?.data ?? res.data;

//       setProducts(prev => prev.map(p => 
//         p._id === currentProduct._id ? {
//           ...updated,
//           rating: calculatingRating(updated._id),
//           reviews: getReviewCount(updated._id),
//           status: getProductStatus(updated.stock)
//         } : p
//       ));
      
//       resetForm();
//       alert('Product updated successfully! ✨');
//     } catch (err) {
//       console.error('Update failed:', err);
//       alert(err.response?.data?.message || 'Update failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this product?')) return;

//     try {
//       await axios.delete(`${API}/${id}`);
//       setProducts(prev => prev.filter(p => p._id !== id));
//       alert('Product deleted successfully! 🗑️');
//     } catch (err) {
//       console.error('Delete failed:', err);
//       alert('Delete failed');
//     }
//   };

//   const resetForm = () => {
//     setIsEditing(false);
//     setCurrentProduct(null);
//     setShowProductForm(false);
//     setFormData(productForm);
//   };

//   const calculateSavings = (original, current) => {
//     return original - current;
//   };

//   const getTrendingProducts = () => {
//     return products
//       .filter(p => p.rating >= 4)
//       .sort((a, b) => b.rating - a.rating)
//       .slice(0, 3);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 lg:p-6">
//       {/* Header Section */}
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
//           <div className="flex-1">
//             <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-3">
//               Product Management
//             </h1>
//             <p className="text-gray-600 text-lg">Manage your product inventory with style and efficiency</p>
            
//             {/* Stats Cards */}
//             <div className="flex flex-wrap gap-4 mt-6">
//               <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[140px]">
//                 <div className="text-2xl font-bold text-gray-800">{products.length}</div>
//                 <div className="text-sm text-gray-600">Total Products</div>
//               </div>
//               <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[140px]">
//                 <div className="text-2xl font-bold text-emerald-600">
//                   {products.filter(p => p.status === 'Active').length}
//                 </div>
//                 <div className="text-sm text-gray-600">Active</div>
//               </div>
//               <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[140px]">
//                 <div className="text-2xl font-bold text-amber-600">
//                   {getTrendingProducts().length}
//                 </div>
//                 <div className="text-sm text-gray-600">Trending</div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
//             <button
//               onClick={() => setShowProductForm(true)}
//               className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold group"
//             >
//               <Plus size={20} className="mr-2 group-hover:scale-110 transition-transform" />
//               Add Product
//             </button>
//             <button
//               onClick={loadProducts}
//               className="bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center font-medium"
//             >
//               <Zap size={20} className="mr-2" />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Trending Products */}
//         {getTrendingProducts().length > 0 && (
//           <div className="mb-8">
//             <div className="flex items-center gap-2 mb-4">
//               <TrendingUp size={20} className="text-rose-500" />
//               <h2 className="text-xl font-semibold text-gray-800">Trending Products</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {getTrendingProducts().map(product => (
//                 <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                   <div className="flex items-center gap-3">
//                     <img src={product.imageurl} alt={product.productname} className="w-12 h-12 rounded-lg object-cover" />
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-800 truncate">{product.productname}</h3>
//                       <div className="flex items-center gap-1">
//                         <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
//                         <span className="text-sm text-gray-600">{product.rating} • {product.reviews} reviews</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4 items-center">
//             {/* Search */}
//             <div className="flex-1 w-full lg:w-auto">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Category Filter */}
//             <div className="w-full lg:w-48">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//               >
//                 <option value="all">All Categories</option>
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Sort By */}
//             <div className="w-full lg:w-48">
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//               >
//                 <option value="name">Sort by Name</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="rating">Highest Rated</option>
//                 <option value="stock">Stock Level</option>
//               </select>
//             </div>

//             <Filter className="text-gray-400 w-5 h-5" />
//           </div>
//         </div>

//         {/* Product Form Modal */}
//         {showProductForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//               <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-2xl font-bold text-gray-800">
//                     {isEditing ? 'Edit Product' : 'Add New Product'}
//                   </h3>
//                   <button
//                     onClick={resetForm}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <X size={24} />
//                   </button>
//                 </div>
//               </div>

//               <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct} className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {['productname', 'price', 'discount', 'originalprice', 'category', 'stock'].map(field => (
//                     <div key={field}>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
//                         {field.replace(/([A-Z])/g, ' $1')}
//                       </label>
//                       {field === 'category' ? (
//                         <select
//                           name={field}
//                           value={formData[field]}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                           required
//                         >
//                           <option value="">Select Category</option>
//                           {categories.map(cat => (
//                             <option key={cat} value={cat}>{cat}</option>
//                           ))}
//                         </select>
//                       ) : (
//                         <input
//                           type={field.includes('price') || field === 'stock' || field === 'discount' ? 'number' : 'text'}
//                           name={field}
//                           value={formData[field]}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                           required={field !== 'discount' && field !== 'originalprice'}
//                           min="0"
//                           step={field.includes('price') ? '0.01' : '1'}
//                         />
//                       )}
//                     </div>
//                   ))}

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows="3"
//                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
//                     <input
//                       type="url"
//                       name="imageurl"
//                       value={formData.imageurl}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     />
//                     {formData.imageurl && (
//                       <img src={formData.imageurl} alt="Preview" className="mt-3 w-32 h-32 rounded-lg object-cover border" />
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? 'Processing...' : (isEditing ? 'Update Product' : 'Add Product')}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Products Table */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <h3 className="text-xl font-semibold text-gray-800">
//               All Products <span className="text-blue-600">({filteredProducts.length})</span>
//             </h3>
//           </div>

//           {loading ? (
//             <div className="p-12 text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600">Loading products...</p>
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="p-12 text-center">
//               <div className="text-gray-400 text-6xl mb-4">📦</div>
//               <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
//               <p className="text-gray-500">Try adjusting your search or add a new product.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pricing</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredProducts.map((product) => (
//                     <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={product.imageurl}
//                             alt={product.productname}
//                             className="w-12 h-12 rounded-xl object-cover border border-gray-200"
//                           />
//                           <div>
//                             <div className="font-semibold text-gray-900">{product.productname}</div>
//                             <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
//                           {product.category}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           <div className="font-semibold text-gray-900">₹{product.price}</div>
//                           {product.discount > 0 && (
//                             <>
//                               <div className="text-sm text-gray-500 line-through">₹{product.originalprice}</div>
//                               <div className="text-xs text-emerald-600 font-medium">
//                                 Save ₹{calculateSavings(product.originalprice, product.price)} ({product.discount}% OFF)
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <div className="flex">
//                             {[...Array(5)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
//                               />
//                             ))}
//                           </div>
//                           <span className="text-sm font-medium text-gray-700">{product.rating || 'N/A'}</span>
//                           <span className="text-xs text-gray-500">({product.reviews})</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{product.stock}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[product.status]}`}>
//                           {product.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleEditProduct(product)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
//                             title="Edit product"
//                           >
//                             <Edit size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteProduct(product._id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
//                             title="Delete product"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductsContent;