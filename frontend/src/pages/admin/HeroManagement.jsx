import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusCircle,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit,
  X,
  Loader,
} from "lucide-react";

const BASE_URL = "http://localhost:3500/api/hero";

const HeroManagement = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productname: "",
    description: "",
    price: "",
    originalprice: "",
    discount: "",
    category: "",
    stock: "",
    imageurl: "",
  });

  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch hero products
  const fetchHeroes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}`);
      setHeroes(res.data.data || res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  // Handle inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editId) {
        // UPDATE
        await axios.put(`${BASE_URL}/updatehero/${editId}`, formData);
      } else {
        // ADD
        await axios.post(`${BASE_URL}/add`, formData);
      }

      setShowForm(false);
      setEditId(null);
      setFormData({
        productname: "",
        description: "",
        price: "",
        originalprice: "",
        discount: "",
        category: "",
        stock: "",
        imageurl: "",
      });

      fetchHeroes();
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start Editing
  const handleEdit = (hero) => {
    setFormData(hero);
    setEditId(hero._id);
    setShowForm(true);
  };

  // Delete Single Hero
  const deleteHero = async (id) => {
    if (!window.confirm("Delete this hero product?")) return;

    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      fetchHeroes();

    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  // Clear All Hero Products
  const clearAll = async () => {
    if (!window.confirm("Delete ALL hero products?")) return;

    try {
      await axios.delete(`${BASE_URL}/clearall`);
      fetchHeroes();
    } catch (error) {
      console.error("Clear error:", error);
    }
  };

  // Reorder (Up/Down)
  const reorder = async (id, direction) => {
    const item = heroes.find((h) => h._id === id);
    if (!item) return;

    const newOrder = direction === "down" ? item.order + 1 : item.order - 1;

    try {
      await axios.put(`${BASE_URL}/updateorder`, {
        items: [{ id: id, order: newOrder }],
      });
      fetchHeroes();
    } catch (err) {
      console.error("Reorder Error:", err);
    }
  };

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hero Section Manager</h1>

        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setFormData({
              productname: "",
              description: "",
              price: "",
              originalprice: "",
              discount: "",
              category: "",
              stock: "",
              imageurl: "",
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
          <PlusCircle size={18} /> Add Hero Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-[450px] relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setShowForm(false)}
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Hero Product" : "Add Hero Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="productname"
                placeholder="Product Name"
                value={formData.productname}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="originalprice"
                type="number"
                placeholder="Original Price"
                value={formData.originalprice}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="discount"
                type="number"
                placeholder="Discount %"
                value={formData.discount}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="imageurl"
                placeholder="Image URL"
                value={formData.imageurl}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded mt-2"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin mx-auto" /> : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero List */}
      <div className="space-y-4">
        {heroes
          .sort((a, b) => a.order - b.order)
          .map((hero) => (
            <div
              key={hero._id}
              className="p-4 border rounded-lg shadow flex justify-between"
            >
              <div className="flex gap-4">
                <img
                  src={hero.imageurl}
                  alt={hero.productname}
                  className="w-20 h-20 object-cover rounded"
                />

                <div>
                  <h3 className="font-bold">{hero.productname}</h3>
                  <p className="text-sm text-gray-600">{hero.category}</p>
                  <p className="text-sm text-gray-600">
                    ₹{hero.price}{" "}
                    <span className="line-through text-red-500">
                      ₹{hero.originalprice}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => reorder(hero._id, "up")}>
                  <ArrowUp />
                </button>
                <button onClick={() => reorder(hero._id, "down")}>
                  <ArrowDown />
                </button>

                <button onClick={() => handleEdit(hero)}>
                  <Edit />
                </button>

                <button onClick={() => deleteHero(hero._id)}>
                  <Trash2 className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {heroes.length > 0 && (
        <button
          onClick={clearAll}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
        >
          Clear All Hero Products
        </button>
      )}
    </div>
  );
};

export default HeroManagement;
