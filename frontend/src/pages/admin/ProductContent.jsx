import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { backend } from "../../ultis/constant";

const API = `${backend}/api/product`;

const ProductsContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showProductForm, setShowProductForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    productname: "",
    price: "",
    discount: "",
    originalprice: "",
    category: "",
    stock: "",
    description: "",
    imageurl: "",
  });

  const categoryname = [
    "Laptop",
    "Phone",
    "HeadPhone",
    "Speaker",
    "Gaming",
    "Smart Watch",
    "Camera",
  ];

  /* =======================
     LOAD PRODUCTS (API)
  ======================= */
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      const data = res.data?.data ?? res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load products failed", error);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     AUTO LOAD ON PAGE OPEN
  ======================= */
  useEffect(() => {
    loadProducts();
  }, []);

  /* =======================
     FORM HANDLERS
  ======================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setShowProductForm(false);
    setIsEditing(false);
    setCurrentProduct(null);
    setProductForm({
      productname: "",
      price: "",
      discount: "",
      originalprice: "",
      category: "",
      stock: "",
      description: "",
      imageurl: "",
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        discount: Number(productForm.discount) || 0,
        originalprice:
          Number(productForm.originalprice) || Number(productForm.price),
        stock: Number(productForm.stock),
      };

      const res = await axios.post(API, payload);
      alert("product add successfully")
      setProducts((prev) => [...prev, res.data?.data ?? res.data]);

      resetForm();
    } catch (error) {
      console.error("Add product failed", error);
    }
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setProductForm(product);
    setIsEditing(true);
    setShowProductForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API}/${currentProduct._id}`,
        productForm
      );
      const updated = res.data?.data ?? res.data;
      alert("Product update successfully")
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      resetForm();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${API}/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your inventory</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              resetForm();
              setShowProductForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Product
          </button>

          <button
            onClick={loadProducts}
            disabled={loading}
            className="bg-gray-100 px-4 py-2 rounded-lg flex items-center justify-center gap-2
                       hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* ================= FORM ================= */}
      {showProductForm && (
        <div className="bg-white border rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
          <h3 className="font-semibold mb-4">
            {isEditing ? "Edit Product" : "Add Product"}
          </h3>

          <form
            onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input name="productname" placeholder="Product Name" value={productForm.productname} onChange={handleInputChange} className="border rounded px-3 py-2" />
            <input name="price" type="number" placeholder="Price" value={productForm.price} onChange={handleInputChange} className="border rounded px-3 py-2" />
            <input name="discount" type="number" placeholder="Discount %" value={productForm.discount} onChange={handleInputChange} className="border rounded px-3 py-2" />
            <input name="originalprice" type="number" placeholder="Original Price" value={productForm.originalprice} onChange={handleInputChange} className="border rounded px-3 py-2" />

            <select name="category" value={productForm.category} onChange={handleInputChange} className="border rounded px-3 py-2">
              {categoryname.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input name="stock" type="number" placeholder="Stock" value={productForm.stock} onChange={handleInputChange} className="border rounded px-3 py-2" />

            <textarea name="description" placeholder="Description" value={productForm.description} onChange={handleInputChange} className="sm:col-span-2 border rounded px-3 py-2 resize-none" />

            <input name="imageurl" placeholder="Image URL" value={productForm.imageurl} onChange={handleInputChange} className="sm:col-span-2 border rounded px-3 py-2" />

            <div className="sm:col-span-2 flex flex-col sm:flex-row sm:justify-end gap-3 mt-4">
              <button type="button" onClick={resetForm} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MOBILE CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img src={p.imageurl} className="w-14 h-14 rounded object-cover" />
              <div>
                <h4 className="font-semibold">{p.productname}</h4>
                <p className="text-sm text-gray-500">₹{p.price}</p>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <span className="text-sm">Stock: {p.stock}</span>
              <div className="flex gap-3">
                <Edit className="text-blue-600 cursor-pointer" size={18} onClick={() => handleEditProduct(p)} />
                <Trash2 className="text-red-600 cursor-pointer" size={18} onClick={() => handleDeleteProduct(p._id)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-x-auto bg-white border rounded-lg mt-6">
        <table className="w-full">
          <thead className="bg-gray-50 ">
            <tr>
              <th className="px-6 py-3 text-center border-r-1 border-gray-500">Product</th>
              <th className="px-6 py-3 text-center border-r-1 border-gray-500">Category</th>
              <th className="px-6 py-3 text-center border-r-1 border-gray-500">Original Price</th>
              <th className="px-6 py-3 text-center border-r-1 border-gray-500">Price</th>
              <th className="px-6 py-3 text-center border-r-1 border-gray-500">Stock</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p._id} className="border-t">
                <td className="px-6 py-4 flex items-center gap-3">
                  <h1>{index + 1}.</h1>
                  <img src={p.imageurl} className="w-10 h-10 rounded object-cover " />
                  {p.productname}
                </td>
                <td className="px-6 py-4 border-l-1 text-center">{p.category}</td>
                <td className="px-6 py-4 border-l-1 text-center">{p.originalprice}</td>
                <td className="px-6 py-4 border-l-1 text-center">₹{p.price}/(discount:{p.discount})</td>
                <td className="px-6 py-4 border-l-1 border-r-1 text-center">{p.stock}</td>
                <td className="px-6 py-4 flex gap-3 text-center ">
                  <Edit className="text-blue-600 cursor-pointer" size={16} onClick={() => handleEditProduct(p)} />
                  <Trash2 className="text-red-600 cursor-pointer" size={16} onClick={() => handleDeleteProduct(p._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsContent;
