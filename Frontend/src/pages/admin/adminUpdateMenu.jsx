import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import axios from "axios";
import { validateMenuForm, hasErrors } from "../../utils/menuValidation";

const styles = `
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

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
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  async function updateMenuItem() {
    // Validate form
    const formErrors = validateMenuForm({
      name,
      description,
      price,
      category,
      prepTime,
      quantity,
    });

    if (hasErrors(formErrors)) {
      setErrors(formErrors);
      toast.error("Please fix validation errors");
      return;
    }

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
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category: category,
        image: imageUrl,
        prepTime: Number(prepTime) || 0,
        quantity: Number(quantity) || 0,
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
    } catch (err) {
      console.log(err.response?.data || err.message);
      
      // Handle backend validation errors
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        toast.error("Please fix validation errors");
      } else {
        toast.error(err.response?.data?.message || "Error updating menu item");
      }
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-primary py-10">
      <style>{styles}</style>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border p-8">

        <h2 className="text-2xl font-semibold text-accent mb-6 border-b pb-3">
          Update Menu Item
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="block text-sm mb-2">Name</label>
            <input
              className={`w-full p-3 border rounded-lg ${errors.name ? "border-red-500" : ""}`}
              value={name}
              onChange={(e) => {
                // Remove special symbols including - and +, only allow letters, numbers, and spaces
                const cleanValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
                setName(cleanValue);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm mb-2">Price</label>
            <input
              type="number"
              min="0"
              placeholder="eg:- 299"
              className={`w-full p-3 border rounded-lg ${errors.price ? "border-red-500" : ""}`}
              value={price}
              onKeyPress={(e) => {
                // Block - and + symbols
                if (e.key === '-' || e.key === '+') {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                // Prevent negative values and remove any - or + symbols
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value === "" || Number(value) >= 0) {
                  setPrice(value);
                }
                if (errors.price) setErrors({ ...errors, price: "" });
              }}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm mb-2">Category</label>
            <select
              className={`w-full p-3 border rounded-lg ${errors.category ? "border-red-500" : ""}`}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors({ ...errors, category: "" });
              }}
            >
              <option value="">Select a category</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks">Snacks</option>
              <option value="Desserts">Desserts</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Prep Time */}
          <div>
            <label className="block text-sm mb-2">Prep Time</label>
            <input
              type="number"
              min="0"
              placeholder="eg:- 15"
              className={`w-full p-3 border rounded-lg ${errors.prepTime ? "border-red-500" : ""}`}
              value={prepTime}
              onKeyPress={(e) => {
                // Block - and + symbols
                if (e.key === '-' || e.key === '+') {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                // Prevent negative values and remove any - or + symbols
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value === "" || Number(value) >= 0) {
                  setPrepTime(value);
                }
                if (errors.prepTime) setErrors({ ...errors, prepTime: "" });
              }}
            />
            {errors.prepTime && <p className="text-red-500 text-sm mt-1">{errors.prepTime}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm mb-2">Quantity</label>
            <input
              type="number"
              min="0"
              placeholder="eg:- 50"
              className={`w-full p-3 border rounded-lg ${errors.quantity ? "border-red-500" : ""}`}
              value={quantity}
              onKeyPress={(e) => {
                // Block - and + symbols
                if (e.key === '-' || e.key === '+') {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                // Prevent negative values and remove any - or + symbols
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value === "" || Number(value) >= 0) {
                  setQuantity(value);
                }
                if (errors.quantity) setErrors({ ...errors, quantity: "" });
              }}
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
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
              placeholder="eg:- Delicious grilled chicken burger with fresh vegetables and special sauce..."
              className={`w-full p-3 border rounded-lg ${errors.description ? "border-red-500" : ""}`}
              value={description}
              onChange={(e) => {
                // Remove special symbols including - and +, allow letters, numbers, spaces, and basic punctuation (., ,, &)
                const cleanValue = e.target.value.replace(/[^a-zA-Z0-9\s\.\,\&]/g, "");
                setDescription(cleanValue);
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate("/admin/menu")}
            className="bg-red-400 text-white px-6 py-3 rounded-lg hover:bg-red-500"
          >
            Cancel
          </button>

          <button
            onClick={updateMenuItem}
            disabled={hasErrors(errors) && Object.values(errors).some(err => err)}
            className={`px-6 py-3 rounded-lg text-white ${hasErrors(errors) && Object.values(errors).some(err => err) ? "bg-gray-400 cursor-not-allowed" : "bg-accent hover:bg-accent/90"}`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}