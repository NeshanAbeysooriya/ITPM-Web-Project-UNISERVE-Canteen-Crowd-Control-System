import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cart state
  const [cart, setCart] = useState(location.state || []);

  // Fetch single menu item if cart is empty and menuId is in URL
  useEffect(() => {
    if ((!cart || cart.length === 0) && location.search) {
      const searchParams = new URLSearchParams(location.search);
      const menuId = searchParams.get("menuId");

      if (menuId) {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/menus/${menuId}`) // ✅ Correct URL
          .then((res) => {
            const item = res.data.data;
            if (item) {
              setCart([
                {
                  _id: item._id,        // ✅ Must be _id for backend
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: 1,
                },
              ]);
            } else {
              toast.error("Menu item not found");
            }
          })
          .catch((err) => {
            console.error(err);
            
            toast.error("Menu item not found");
          });
      }
    }
  }, [cart, location.search]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

 async function purchaseCart() {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login first");
    navigate("/login");
    return;
  }

  if (!cart || cart.length === 0) {
    toast.error("Your cart is empty");
    return;
  }

  if (!name.trim()) {
    toast.error("Name is required");
    return;
  }

  if (name.trim().length < 3) {
    toast.error("Name must be at least 3 characters");
    return;
  }

  const phoneRegex = /^07\d{8}$/;
  if (!phone.trim()) {
    toast.error("Phone number is required");
    return;
  }

  if (!phoneRegex.test(phone.trim())) {
    toast.error("Enter a valid phone number (e.g. 0712345678)");
    return;
  }

  try {
    setIsSubmitting(true);

    // ✅ Make sure every cart item has _id
    const items = cart.map(item => {
      if (!item._id) {
        throw new Error(`Cart item "${item.name}" is missing _id`);
      }
      return {
        _id: item._id,
        quantity: item.quantity
      };
    });

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/orders`,
      {
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim() || null,
        items,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Order placed!");
    setOrderId(res.data.order?.orderID || "—");
    setShowSuccess(true);

  } catch (err) {
    toast.error(err.response?.data?.message || err.message || "Failed to place order");
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
}
  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left / Main: Form */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-secondary mb-8">Checkout</h1>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-boardercolor/30">
            <div className="space-y-6">

              {/* NAME */}
              <div>
                <label className="block text-base font-medium text-secondary mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-5 py-4 border border-boardercolor rounded-xl focus:ring-2 focus:ring-accent/40 focus:border-accent outline-none"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-base font-medium text-secondary mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                  maxLength={10}
                  className="w-full px-5 py-4 border border-boardercolor rounded-xl focus:ring-2 focus:ring-accent/40 focus:border-accent outline-none"
                  placeholder="0712345678"
                  required
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className="block text-base font-medium text-secondary mb-2">
                  Pickup Notes / Special Requests
                </label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 border border-boardercolor rounded-xl focus:ring-2 focus:ring-accent/40 focus:border-accent outline-none resize-none"
                  placeholder="Add instructions for your order (allergies, preferences,etc)"
                />
              </div>

              {/* TIME SLOT */}
              <div>
                <label className="block text-base font-medium text-secondary mb-2">
                  Preferred Pickup Time
                </label>
                <button
                    type="button"
                    className="w-full px-5 py-4 bg-accent/5 border border-accent/30 rounded-xl text-accent font-medium hover:bg-accent/10 transition flex justify-between items-center"
                    onClick={() => navigate("/time-slots")}
                >
                  <span>Select time slot</span>
                  <span>→</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-boardercolor/30 sticky top-8">
            <h2 className="text-2xl font-bold text-secondary mb-6">Order Summary</h2>

            <div className="space-y-5 mb-8">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-secondary">{item.name}</p>
                    <p className="text-sm text-secondary/70">
                      {item.quantity} × LKR {item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium text-accent whitespace-nowrap">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xl font-bold text-accent pt-3 border-t border-boardercolor">
              <span>Total</span>
              <span>LKR {total.toFixed(2)}</span>
            </div>

            <button
              onClick={purchaseCart}
              disabled={isSubmitting}
              className="w-full mt-8 bg-accent text-white py-4 rounded-xl font-semibold text-lg hover:bg-accent/90 transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl transition-colors"
              onClick={() => setShowSuccess(false)}
            >
              ×
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-secondary text-center mb-3">
              Order Confirmed
            </h2>

            <p className="text-center text-secondary/80 mb-2">
              Your order has been successfully placed.
            </p>

            <p className="text-center text-secondary/70 mb-8 text-sm">
              Order ID: <span className="font-semibold text-accent">#{orderId || '—'}</span>
              <br />
              Please arrive at the canteen around your selected pickup time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/track");
                }}
                className="bg-accent text-white px-8 py-3.5 rounded-xl font-medium hover:bg-accent/90 transition shadow-sm flex-1 sm:flex-none"
              >
                View My Orders
              </button>

              <button
                onClick={() => setShowSuccess(false)}
                className="border border-gray-300 text-secondary px-8 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition flex-1 sm:flex-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}