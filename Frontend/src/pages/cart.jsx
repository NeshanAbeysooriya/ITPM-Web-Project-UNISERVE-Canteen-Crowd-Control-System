import { FaCaretDown, FaSortUp, FaArrowLeft } from "react-icons/fa"; // Added FaArrowLeft
import { FaRegTrashCan } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router-dom";
import { addToCart, getTotal, loadCart } from "../utils/cart";

export default function CartPage() {
  const [cart, setCart] = useState(loadCart());

  const refreshCart = () => setCart(loadCart());

  const totalAmount = getTotal();

  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation Back */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          {cart.length > 0 && (
            <Link
              to="/menu"
              className="inline-flex items-center text-accent hover:text-accent/80 font-medium transition"
            >
              <FaArrowLeft className="mr-2" size={14} />
              Continue Shopping
            </Link>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
            <div className="mx-auto w-20 h-20 mb-6 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h18l-2 12H5L3 3zM16 18a2 2 0 11-4 0 2 2 0 014 0zM8 18a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add some delicious items from the canteen menu!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center px-8 py-4 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition shadow-md"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-5 mb-10">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                    {/* Image */}
                    <div className="w-full sm:w-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 sm:h-32 object-cover rounded-lg border border-gray-100"
                      />
                    </div>

                    {/* Main content */}
                    <div className="flex-1 flex flex-col">
                      {/* Name & Delete */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.productID}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            addToCart(
                              {
                                _id: item._id ?? item.productID ?? item.name,
                                name: item.name,
                                price: item.price,
                                image: item.image,
                                quantity: item.quantity,
                              },
                              -item.quantity
                            );
                            refreshCart();
                          }}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                          aria-label="Remove item"
                        >
                          <FaRegTrashCan size={20} />
                        </button>
                      </div>

                      {/* Quantity + Price */}
                      <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => {
                              addToCart(
                                {
                                  _id: item._id ?? item.productID ?? item.name,
                                  name: item.name,
                                  price: item.price,
                                  image: item.image,
                                  quantity: item.quantity,
                                },
                                -1
                              );
                              refreshCart();
                            }}
                            className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                            disabled={item.quantity <= 1}
                          >
                            <FaCaretDown size={18} />
                          </button>

                          <span className="px-6 py-3 font-semibold text-lg border-x border-gray-300 min-w-[60px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => {
                              addToCart(
                                {
                                  _id: item._id ?? item.productID ?? item.name,
                                  name: item.name,
                                  price: item.price,
                                  image: item.image,
                                  quantity: item.quantity,
                                },
                                1
                              );
                              refreshCart();
                            }}
                            className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                          >
                            <FaSortUp size={18} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.labelledPrice > item.price && (
                            <p className="text-sm text-gray-500 line-through">
                              LKR {item.labelledPrice.toFixed(2)}
                            </p>
                          )}
                          <p className="text-xl font-bold text-accent">
                            LKR {item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            × {item.quantity} = LKR{" "}
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Total Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-20 md:static md:mt-8 md:max-w-4xl md:mx-auto md:rounded-xl md:shadow-md md:border">
              <div className="max-w-4xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-3xl font-bold text-accent">
                    LKR {totalAmount.toFixed(2)}
                  </p>
                </div>

                <Link
                  to="/checkout"
                  state={cart.map((item) => ({
                    _id: item._id ?? item.productID ?? item.name,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity,
                  }))}
                  className="w-full sm:w-auto bg-accent text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-accent/90 transition shadow-md text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}