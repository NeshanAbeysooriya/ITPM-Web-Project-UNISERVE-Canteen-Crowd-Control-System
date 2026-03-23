import { useState, useEffect } from "react";
import axios from "axios";
import { MdEdit, MdDelete, MdRestaurantMenu, MdAddCircle, MdOutlineCancel } from "react-icons/md";
import { Link } from "react-router-dom";
import Footer from "../components/footer";

const initialForm = {
  menuID: "",
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  quantity: "",
  prepTime: "",
  isAvailable: true,
};

const categories = ["Breakfast", "Lunch", "Beverages", "Snacks", "Desserts"];

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("All"); 
  const [filterCategory, setFilterCategory] = useState("All");

  async function loadMenu() {
    try {
      setLoading(true);
      setError("");
      const url = `/api/menu`;
      const response = await axios.get(url);
      if (response.data && response.data.success) {
        setMenuItems(response.data.data);
      } else {
        setMenuItems([]);
      }
    } catch (e) {
      console.error(e);
      setError("Cannot load menu items. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenu();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim() || !form.price || !form.category) {
      setError("Name, description, price and category are required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      image: form.image.trim() ? form.image.trim() : "no-photo.jpg",
      quantity: Number(form.quantity) || 0,
      prepTime: Number(form.prepTime) || 15,
      isAvailable: Boolean(form.isAvailable),
    };

    // Include menuID only for updates
    if (isEditing) {
      payload.menuID = form.menuID;
    }

    try {
      setLoading(true);
      if (isEditing && editingId) {
        await axios.put(`/api/menu/${editingId}`, payload);
      } else {
        await axios.post(`/api/menu`, payload);
      }
      await loadMenu();
      resetForm();
    } catch (e) {
      console.error("Save menu error", e.response?.data || e.message);
      const serverMessage = e.response?.data?.message || e.message;
      setError(serverMessage || "Failed to save menu item. Please verify input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      menuID: item.menuID,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image || "",
      quantity: item.quantity || 0,
      prepTime: item.prepTime || 15,
      isAvailable: item.isAvailable,
    });
    setIsEditing(true);
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      setLoading(true);
      await axios.delete(`/api/menu/${itemId}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (e) {
      console.error(e);
      setError("Could not delete item. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      setLoading(true);
      await axios.put(`/api/menu/${item._id}`, { isAvailable: !item.isAvailable });
      setMenuItems((prev) =>
        prev.map((it) => (it._id === item._id ? { ...it, isAvailable: !it.isAvailable } : it))
      );
    } catch (e) {
      console.error(e);
      setError("Failed to toggle availability.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems
    .filter((item) =>
      (filterCategory === "All" || item.category === filterCategory) &&
      (!search || item.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-primary text-secondary font-sans selection:bg-accent/30 pt-24 pb-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-2">
            <MdRestaurantMenu /> Menu Management
          </h1>
          <Link
            to="/"
            className="px-4 py-2 bg-secondary text-primary rounded-lg font-semibold hover:bg-secondary/90"
          >
            Back to User Home
          </Link>
        </div>

        <section className="bg-white/10 border border-bordercolor rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit" : "Add"} Food Item</h2>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Item name"
              className="p-3 rounded-xl bg-white/90 border border-bordercolor"
            />
            {isEditing && (
              <input
                value={form.menuID}
                readOnly
                placeholder="Menu ID"
                className="p-3 rounded-xl bg-gray-100 border border-bordercolor"
              />
            )}
            <input
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              placeholder="Price (LKR)"
              type="number"
              min="0"
              className="p-3 rounded-xl bg-white/90 border border-bordercolor"
            />
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="p-3 rounded-xl bg-white/90 border border-bordercolor"
            >
              <option value="" disabled hidden>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Description"
              className="p-3 rounded-xl bg-white/90 border border-bordercolor md:col-span-2"
            />
            <input
              value={form.quantity}
              onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
              placeholder="Quantity in stock"
              type="number"
              min="0"
              className="p-3 rounded-xl bg-white/90 border border-bordercolor"
            />
            <input
              value={form.prepTime}
              onChange={(e) => setForm((p) => ({ ...p, prepTime: e.target.value }))}
              placeholder="Prep Time (min)"
              type="number"
              min="1"
              className="p-3 rounded-xl bg-white/90 border border-bordercolor"
            />
            <input
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="Image filename (e.g., chicken kottu.jpg)"
              className="p-3 rounded-xl bg-white/90 border border-bordercolor md:col-span-2"
            />
            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm((p) => ({ ...p, isAvailable: e.target.checked }))}
                className="w-4 h-4"
              />
              Mark as available (uncheck for sold out)
            </label>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition"
              >
                <MdAddCircle /> {isEditing ? "Update Item" : "Add Item"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700/80 text-white rounded-xl hover:bg-gray-700"
                >
                  <MdOutlineCancel /> Cancel
                </button>
              )}
            </div>
            {error && <p className="md:col-span-2 text-red-200 font-medium">{error}</p>}
          </form>
        </section>

        <section className="bg-white/10 border border-bordercolor rounded-2xl p-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items"
              className="p-3 rounded-xl bg-white/90 border border-bordercolor flex-1 min-w-[220px]"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-3 rounded-xl bg-white/90 border border-bordercolor"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => { setSearch(""); setFilterCategory("All"); }}
              className="px-4 py-2 bg-secondary text-primary rounded-xl"
            >
              Clear Filters
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-secondary/80">No items found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div key={item._id} className="bg-white/10 border border-bordercolor rounded-2xl p-4 shadow-sm">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex-1">
                      <p className="text-xs text-secondary/60 mb-1">ID: {item.menuID}</p>
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-sm text-secondary/80">{item.category}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold ${
                        item.isAvailable ? "bg-emerald-500/25 text-emerald-400" : "bg-red-500/20 text-red-200"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Sold Out"}
                    </span>
                  </div>

                  {item.image && item.image !== "no-photo.jpg" && (
                    <img 
                      src={item.image.startsWith('http') ? item.image : `/${item.image}`}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}

                  <p className="mt-2 text-sm leading-relaxed">{item.description}</p>
                  <p className="mt-2 text-lg font-black">LKR {item.price}</p>
                  <p className="text-xs text-secondary/60">Prep: {item.prepTime} min | Stock: {item.quantity}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className="px-3 py-2 bg-accent/90 text-white rounded-lg text-sm"
                    >
                      {item.isAvailable ? "Mark Sold Out" : "Mark Available"}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-2 bg-highlight/85 text-white rounded-lg text-sm flex items-center gap-1"
                    >
                      <MdEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-2 bg-red-500/80 text-white rounded-lg text-sm"
                    >
                      <MdDelete /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
