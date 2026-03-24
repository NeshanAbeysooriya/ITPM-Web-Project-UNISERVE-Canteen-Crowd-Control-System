import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Loder } from "../components/loder";
import Footer from "../components/footer";
import { addToCart, loadCart } from "../utils/cart"; // <-- added

export default function MenuOverview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/menus/" + id)
      .then((res) => {
        setItem(res.data.data || res.data);
        setStatus("success");
      })
      .catch(() => {
        toast.error("Failed to fetch menu item");
        setStatus("error");
      });
  }, [id]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-primary to-white text-secondary">

      {status === "loading" && <Loder />}

      {status === "success" && item && (
        <div className="w-full px-4 md:px-12 lg:px-20 py-10 flex flex-col gap-12">

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-accent">
            {item.name}
          </h1>

          <div className="flex flex-col lg:flex-row gap-10">

            {/* IMAGE */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `http://localhost:5000/uploads/${item.image}`
                }
                className="w-[350px] rounded-2xl shadow-lg"
              />
            </div>

            {/* DETAILS */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">

              {/* CATEGORY */}
              <p className="text-lg font-semibold">
                Category: <span className="text-accent">{item.category}</span>
              </p>

              {/* DESCRIPTION */}
              <p className="text-secondary/80">{item.description}</p>

              {/* PRICE */}
              <p className="text-3xl font-bold text-accent">
                Rs. {item.price}
              </p>

              {/* PREP TIME */}
              <p>⏱ Prep Time: {item.prepTime} mins</p>

              {/* QUANTITY */}
              <p>📦 Available Quantity: {item.quantity}</p>

              {/* STATUS */}
              <p>
                {item.isAvailable ? (
                  <span className="text-green-600 font-semibold">
                    Available
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Sold Out
                  </span>
                )}
              </p>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {/* ADD TO CART */}
                <button
                  className="flex-1 h-[50px] rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-all"
                  onClick={() => {
                    // Add current item to cart
                    addToCart(
                      {
                        _id: item._id ?? item.productID ?? item.name,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1,
                      },
                      1
                    );

                    // Optional: reload cart if needed
                    loadCart();

                    toast.success("Added to Cart Successfully");

                    // Optional: go to cart page immediately
                    // navigate("/cart");
                  }}
                >
                  Add to Cart
                </button>

                {/* ORDER NOW */}
                <button
                  className="flex-1 h-[50px] rounded-xl border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-white transition-all"
                  onClick={() => {
                    navigate("/checkout", {
                      state: [
                        {
                          _id: item._id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          quantity: 1,
                        },
                      ],
                    });
                  }}
                >
                  Order Now
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <h1 className="text-red-500 text-center mt-20">
          Failed to load menu item
        </h1>
      )}

      <Footer />
    </div>
  );
}