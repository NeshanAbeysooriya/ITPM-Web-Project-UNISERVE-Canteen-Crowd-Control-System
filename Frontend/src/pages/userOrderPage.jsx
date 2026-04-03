import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Footer from "../components/footer";
import { Loder } from "../components/loder";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("ready") || s.includes("collected")) return "bg-green-100 text-green-800 border-green-200";
    if (s.includes("preparing") || s.includes("processing")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (s.includes("pending") || s.includes("placed")) return "bg-amber-100 text-amber-800 border-amber-200";
    if (s.includes("cancel")) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const downloadInvoice = (order) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    // ... paste your full PDF generation logic here ...
    doc.save(`order-${order.orderID || "unknown"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 pt-30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              My Orders
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage your recent canteen orders
            </p>
          </div>

          {orders.length > 0 && (
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loder />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-100">
            <div className="mx-auto w-24 h-24 mb-6 opacity-70">
              <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18l-2 12H5L3 3zM16 18a2 2 0 11-4 0 2 2 0 014 0zM8 18a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              When you place your first order from the canteen, it will appear here.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="inline-flex items-center px-8 py-4 bg-accent text-white font-medium rounded-2xl hover:bg-accent/90 transition shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Order Something Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderID}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="font-bold text-lg text-gray-900">
                      Order #{order.orderID}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(order.date).toLocaleString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusStyle(order.status)}`}
                    >
                      {order.status || "Placed"}
                    </span>

                    <span className="font-bold text-xl text-accent">
                      LKR {Number(order.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-4 flex items-center gap-5 hover:bg-gray-50/70 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || "/placeholder-food.jpg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {item.quantity} × LKR {Number(item.price || 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="text-right font-medium text-gray-900 whitespace-nowrap">
                        LKR {(item.quantity * (item.price || 0)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-5 bg-gray-50/70 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 text-accent border border-accent/30 rounded-xl font-medium hover:bg-accent/20 hover:border-accent/50 transition group-hover:bg-accent/15"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Download Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}