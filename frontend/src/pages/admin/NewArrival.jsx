import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../../ultis/constant";

const NewArrival = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    productname: "",
    description: "",
    price: "",
    originalprice: "",
    imageurl: "",
    category: "general",
    isNewArrival: true,
  });

  const [editingId, setEditingId] = useState(null);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backend}/api/arrival/allproduct`);
      if (response.data.success === true) {
        setProducts(response.data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalprice: Number(formData.originalprice),
      };

      if (editingId) {
        await axios.put(
          `${backend}/api/arrival/updateproduct/${editingId}`,
          payload
        );
        alert("Product updated successfully!");
      } else {
        await axios.post(
          `${backend}/api/arrival/createproduct`,
          payload
        );
        alert("Product added successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving product");
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${backend}/api/arrival/deleteproduct/${id}`);
    fetchProducts();
  };

  const resetForm = () => {
    setFormData({
      productname: "",
      description: "",
      price: "",
      originalprice: "",
      imageurl: "",
      category: "general",
      isNewArrival: true,
    });
    setEditingId(null);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Admin – New Arrival
      </h1>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= FORM ================= */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="productname"
              placeholder="Product Name"
              value={formData.productname}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full p-3 border rounded-lg resize-none"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="p-3 border rounded-lg"
                required
              />
              <input
                name="originalprice"
                type="number"
                placeholder="Original Price"
                value={formData.originalprice}
                onChange={handleChange}
                className="p-3 border rounded-lg"
                required
              />
            </div>

            <input
              name="imageurl"
              placeholder="Image URL"
              value={formData.imageurl}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="general">General</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="beauty">Beauty</option>
              <option value="home">Home</option>
            </select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="h-5 w-5"
              />
              <span>Show in New Arrival</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ================= PRODUCT LIST ================= */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Product List ({products.length})
          </h2>

          <div className="space-y-4 lg:max-h-[600px] lg:overflow-y-auto">
            {products.length === 0 && (
              <p className="text-center text-gray-500">
                No products found.
              </p>
            )}

            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between gap-4"
              >
                <div className="flex gap-4">
                  <img
                    src={product.imageurl}
                    alt={product.productname}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {product.productname}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="mt-2">
                      <span className="text-blue-600 font-bold">
                        ₹{product.price}
                      </span>{" "}
                      <span className="line-through text-gray-500">
                        ₹{product.originalprice}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
