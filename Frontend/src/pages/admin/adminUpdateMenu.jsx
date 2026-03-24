import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import axios from "axios";

export default function UpdateMenuPage() {
  const location = useLocation();

  const [name, setName] = useState(location.state.name);
  const [description, setDescription] = useState(location.state.description);
  const [price, setPrice] = useState(location.state.price);
  const [category, setCategory] = useState(location.state.category);
  const [prepTime, setPrepTime] = useState(location.state.prepTime);
  const [quantity, setQuantity] = useState(location.state.quantity);
  const [isAvailable, setIsAvailable] = useState(location.state.isAvailable);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  async function updateMenuItem() {
    const token = localStorage.getItem("token");

    if (token == null) {
      navigate("/login");
      return;
    }

    try {
      let imageUrl = location.state.image;

      // upload new image if selected
      if (image) {
        imageUrl = await mediaUpload(image);
      }

      const updatedItem = {
        name: name,
        description: description,
        price: Number(price),
        category: category,
        image: imageUrl,
        prepTime: Number(prepTime),
        quantity: Number(quantity),
        isAvailable: isAvailable,
      };

      await axios.put(
        import.meta.env.VITE_API_URL + "/api/menus/" + location.state._id,
        updatedItem,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Menu Item Updated Successfully");
      navigate("/admin/menu");
    } catch {
      toast.error("Error updating menu item");
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-primary py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border p-8">

        <h2 className="text-2xl font-semibold text-accent mb-6 border-b pb-3">
          Update Menu Item
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="block text-sm mb-2">Name</label>
            <input
              className="w-full p-3 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm mb-2">Price</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm mb-2">Category</label>
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
            <label className="block text-sm mb-2">Prep Time</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm mb-2">Quantity</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm mb-2">Availability</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={isAvailable}
              onChange={(e) => setIsAvailable(e.target.value === "true")}
            >
              <option value={true}>Available</option>
              <option value={false}>Unavailable</option>
            </select>
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-2">Change Image</label>
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-2">Description</label>
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
            onClick={updateMenuItem}
            className="bg-accent text-white px-6 py-3 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}