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
import { backend } from "../../ultis/constant";

const BASE_URL = `${backend}/api/hero`;

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

  /* ================= FETCH ================= */
  const fetchHeroes = async () => {
    try {
      const res = await axios.get(`${backend}/api/hero`);
      setHeroes(res.data.data || res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editId) {
        await axios.put(
          `${backend}/api/hero/updatehero/${editId}`,
          formData
        );
      } else {
        await axios.post(`${backend}/api/hero/add`, formData);
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

  const handleEdit = (hero) => {
    setFormData(hero);
    setEditId(hero._id);
    setShowForm(true);
  };

  const deleteHero = async (id) => {
    if (!window.confirm("Delete this hero product?")) return;
    await axios.delete(`${backend}/api/hero/delete/${id}`);
    fetchHeroes();
  };

  const clearAll = async () => {
    if (!window.confirm("Delete ALL hero products?")) return;
    await axios.delete(`${backend}/api/hero/clearall`);
    fetchHeroes();
  };

  const reorder = async (id, direction) => {
    const item = heroes.find((h) => h._id === id);
    if (!item) return;

    const newOrder =
      direction === "down" ? item.order + 1 : item.order - 1;

    await axios.put(`${BASE_URL}/updateorder`, {
      items: [{ id, order: newOrder }],
    });

    fetchHeroes();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          Hero Section Manager
        </h1>

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
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow w-full sm:w-auto"
        >
          <PlusCircle size={18} /> Add Hero Product
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-5 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3"
              onClick={() => setShowForm(false)}
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editId ? "Edit Hero Product" : "Add Hero Product"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <input
                name="productname"
                placeholder="Product Name"
                value={formData.productname}
                onChange={handleChange}
                className="border p-2 rounded sm:col-span-2"
                required
              />

              <input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded sm:col-span-2"
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <input
                name="originalprice"
                type="number"
                placeholder="Original Price"
                value={formData.originalprice}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="discount"
                type="number"
                placeholder="Discount %"
                value={formData.discount}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="imageurl"
                placeholder="Image URL"
                value={formData.imageurl}
                onChange={handleChange}
                className="border p-2 rounded sm:col-span-2"
                required
              />

              <button
                type="submit"
                className="sm:col-span-2 bg-green-600 text-white py-2 rounded mt-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin mx-auto" />
                ) : (
                  "Save"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= HERO LIST ================= */}
      <div className="space-y-4">
        {heroes
          .sort((a, b) => a.order - b.order)
          .map((hero) => (
            <div
              key={hero._id}
              className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between gap-4"
            >
              <div className="flex gap-4">
                <img
                  src={hero.imageurl}
                  alt={hero.productname}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-bold">{hero.productname}</h3>
                  <p className="text-sm text-gray-600">
                    {hero.category}
                  </p>
                  <p className="text-sm">
                    ₹{hero.price}{" "}
                    <span className="line-through text-red-500">
                      ₹{hero.originalprice}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 items-center justify-end">
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

      {/* ================= CLEAR ALL ================= */}
      {heroes.length > 0 && (
        <div className="flex justify-center sm:justify-end">
          <button
            onClick={clearAll}
            className="mt-6 px-5 py-2 bg-red-600 text-white rounded"
          >
            Clear All Hero Products
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroManagement;
