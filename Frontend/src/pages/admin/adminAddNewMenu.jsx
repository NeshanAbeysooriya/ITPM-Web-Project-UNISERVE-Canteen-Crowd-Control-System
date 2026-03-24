import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddMenuPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [prepTime, setPrepTime] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const navigate = useNavigate();

  async function addMenuItem() {
    const token = localStorage.getItem("token");

    if (token == null) {
      navigate("/login");
      return;
    }

    try {
      let imageUrl = "";

      // upload image if selected
      if (image) {
        imageUrl = await mediaUpload(image);
      }

      const menuItem = {
        name: name,
        description: description,
        price: Number(price),
        category: category,
        image: imageUrl,
        prepTime: Number(prepTime),
        quantity: Number(quantity),
      };

      await axios.post(
        import.meta.env.VITE_API_URL + "/api/menus",
        menuItem,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Menu Item Added Successfully");
      navigate("/admin/menu");
    } catch (err) {
  console.log(err.response?.data || err.message);
  toast.error(err.response?.data?.message || "Error adding menu item");
}
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-primary py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-boardercolor p-8">
        <h2 className="text-2xl font-semibold text-accent mb-6 border-b pb-3">
          Add Menu Item
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Food Name
            </label>
            <input
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., Chicken Burger"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Price
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Category
            </label>
            <select
              className="w-full p-3 border rounded-lg"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks">Snacks</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>

          {/* Prep Time */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Prep Time (minutes)
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Quantity
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-2">
              Image
            </label>
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border rounded-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate("/admin/menu")}
            className="bg-red-400 text-white px-6 py-3 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={addMenuItem}
            className="bg-accent text-white px-6 py-3 rounded-lg"
          >
            Save Menu Item
          </button>
        </div>
      </div>
    </div>
  );
}