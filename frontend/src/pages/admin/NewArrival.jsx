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
        isNewArrival: true
    });

    const [editingId, setEditingId] = useState(null);

  

    // Fetch Products
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

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                originalprice: Number(formData.originalprice)
            };

            if (editingId) {
                // Update
                await axios.put(`${backend}/api/arrival/updateproduct/${editingId}`, productData);
                alert("Product updated successfully!");
            } else {
                // Create
                await axios.post(`${backend}/api/arrival/createproduct`, productData);
                alert("Product added successfully!");
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error saving product");
        }
    };

    // Edit Product
    const handleEdit = (product) => {
        setFormData({
            productname: product.productname,
            description: product.description,
            price: product.price,
            originalprice: product.originalprice,
            imageurl: product.imageurl,
            category: product.category,
            isNewArrival: product.isNewArrival
        });

        setEditingId(product._id);
    };

    // Delete Product
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`${backend}/api/arrival/deleteproduct/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // Reset Form
    const resetForm = () => {
        setFormData({
            productname: "",
            description: "",
            price: "",
            originalprice: "",
            imageurl: "",
            category: "general",
            isNewArrival: true
        });
        setEditingId(null);
    };

    if (loading) {
        return <div className="p-5 text-center">Loading...</div>;
    }

    return (
        <div className="p-5 md:p-8">

            <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin – New Arrival</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Product Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                        {editingId ? "Edit Product" : "Add New Product"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-gray-700">Product Name</label>
                            <input
                                type="text"
                                name="productname"
                                value={formData.productname}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg resize-none "
                                rows={1}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700">Original Price</label>
                                <input
                                    type="number"
                                    name="originalprice"
                                    value={formData.originalprice}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700">Image URL</label>
                            <input
                                type="text"
                                name="imageurl"
                                value={formData.imageurl}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700">Category</label>
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
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isNewArrival"
                                checked={formData.isNewArrival}
                                onChange={handleChange}
                                className="h-5 w-5"
                            />
                            <label>Show in New Arrival</label>
                        </div>

                        <div className="flex gap-3 pt-3">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                                {editingId ? "Update Product" : "Add Product"}
                            </button>

                            {editingId && (
                                <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-3 rounded-lg">
                                    Cancel
                                </button>
                            )}
                        </div>

                    </form>
                </div>

                {/* Product List */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                        Product List ({products.length})
                    </h2>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto">

                        {products.length === 0 && (
                            <p className="text-center text-gray-500">No products found.</p>
                        )}

                        {products.map((product) => (
                            <div key={product._id} className="border p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <div className="flex gap-4">
                                        <img
                                            src={product.imageurl}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold">{product.productname}</h3>
                                            <p className="text-gray-600">{product.description}</p>

                                            <p className="mt-2">
                                                <span className="text-blue-600 font-bold">₹{product.price}</span>
                                                {" "}
                                                <span className="line-through text-gray-500">₹{product.originalprice}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
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
                            </div>
                        ))}

                    </div>
                </div>

            </div>

        </div>
    );
};

export default NewArrival;
