import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loder } from "../components/loder";
import { 
  Package, 
  ChefHat, 
  CheckCircle2, 
  Clock, 
  ShoppingBag,
  ArrowRightCircle
} from "lucide-react"; 
import { jwtDecode } from "jwt-decode";

export default function OrderTrackingPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setOrders([]);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userEmail = decoded.email;
      if (!userEmail) {
        navigate("/login");
        return;
      }

      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userOrders = res.data.filter(order => order.email === userEmail);
      setOrders(userOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.response && err.response.status === 401) navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("ready") || s.includes("collected") || s.includes("completed"))
      return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("preparing") || s.includes("processing"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  const getProgressWidth = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("ready") || s.includes("completed")) return "w-full";
    if (s.includes("preparing")) return "w-1/2";
    return "w-1/4";
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
             <ShoppingBag className="text-accent" size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Track Your Orders
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Real-time updates on your delicious purchases
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loder />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Clock className="text-gray-300" size={40} />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              No active orders found
            </p>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              Ready for something new? Your active orders will show up here.
            </p>
            <button 
              onClick={() => navigate('/product')}
              className="mt-8 bg-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div
                key={order.orderID}
                className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 border border-white hover:border-accent/20 transition-all duration-300"
              >
                {/* Order Meta Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Reference</span>
                    <h3 className="font-black text-2xl text-gray-900 flex items-center gap-2">
                      #{order.orderID}
                    </h3>
                    <p className="text-sm font-semibold text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={14} /> {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.date).toLocaleDateString()}
                    </p>

                    {/* ✅ Real Pickup Slot */}
                    <p className="text-sm text-amber-600 mt-2 font-medium">
                      Pickup Slot:{" "}
                      {order.pickupTime?.startTime && order.pickupTime?.endTime
                        ? `${new Date(order.pickupTime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(order.pickupTime.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : "Not assigned"}
                    </p>
                  </div>

                  <div className={`px-5 py-2 rounded-2xl border text-sm font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                    {order.status || "Processing"}
                  </div>
                </div>

                {/* Items Summary Card */}
                <div className="bg-gray-50 rounded-2xl p-5 mb-10">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Items List</h4>
                  <div className="space-y-3">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-accent/40" />
                           <span className="text-gray-700 font-bold text-sm">
                            {item.name} <span className="text-gray-400 ml-1">×{item.quantity}</span>
                          </span>
                        </div>
                        <span className="text-gray-900 font-black text-sm">
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                      Total
                    </span>
                    <span className="text-lg font-black text-accent">
                      LKR {order.items?.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Steps */}
                <div className="relative mb-12">
                  <div className="flex justify-between mb-4">
                    <ProgressStep icon={<Package size={18}/>} label="Placed" active={true} />
                    <ProgressStep icon={<ChefHat size={18}/>} label="Preparing" active={order.status?.toLowerCase().includes("preparing") || order.status?.toLowerCase().includes("ready")} />
                    <ProgressStep icon={<CheckCircle2 size={18}/>} label="Ready" active={order.status?.toLowerCase().includes("ready")} />
                  </div>

                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressWidth(order.status)} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)] ${
                        order.status?.toLowerCase().includes("ready") ? "bg-green-500" : "bg-accent"
                      }`}
                    />
                  </div>
                </div>

                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-dashed border-gray-200 gap-4">
                  {order.pickupTime?.startTime && order.pickupTime?.endTime ? (
                    <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-xl">
                      <span className="text-xl">⏱</span>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-amber-600 leading-none">Pickup Estimate</p>
                        <p className="text-sm font-black text-amber-900">
                          {new Date(order.pickupTime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(order.pickupTime.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Pickup slot not assigned yet</p>
                  )}

                  <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter italic">
                    <ArrowRightCircle size={16} className="text-accent" />
                    Present your ID at the counter
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressStep({ icon, label, active }) {
  return (
    <div className={`flex flex-col items-center gap-2 transition-colors duration-500 ${active ? 'text-accent' : 'text-gray-300'}`}>
      <div className={`p-2.5 rounded-xl border-2 transition-all duration-500 ${active ? 'bg-accent/5 border-accent' : 'bg-white border-gray-100'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}