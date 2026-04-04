import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  MdOutlineTimer, 
  MdCheckCircle, 
  MdAccessTime, 
  MdChevronRight, 
  MdStar, 
  MdFastfood,
  MdRadioButtonChecked,
  MdShoppingBag
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Loder } from "../components/loder";

export default function UserOverview() {
  const [orders, setOrders] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Use your specific API URL from env
        const [ordersRes, slotsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/api/slots`, config).catch(() => ({ data: [] })) 
        ]);

        // Log to console so you can see the raw data structure
        console.log("Orders Received:", ordersRes.data);
        
        setOrders(ordersRes.data || []);
        setSlots(slotsRes.data || []);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 1. IMPROVED LOGIC: Get the latest order regardless of status
  const latestOrder = orders.length > 0 ? orders[0] : null;

  // 2. Logic: Progress based on status keywords
  const getProgress = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("ready") || s.includes("collected")) return 100;
    if (s.includes("preparing") || s.includes("processing")) return 65;
    if (s.includes("placed") || s.includes("pending")) return 30;
    return 10;
  };

  // 3. Logic: Best Pickup Window (Slot with min orders)
  const bestSlot = slots.length > 0 
    ? [...slots].sort((a, b) => a.currentOrders - b.currentOrders)[0] 
    : null;

  if (isLoading) return <div className="flex justify-center items-center h-64"><Loder /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto p-4 pb-20">
      
      {/* 1. STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-bordercolor p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
            <MdFastfood size={22} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-secondary/30 tracking-widest">Orders</p>
            <p className="font-bold text-secondary text-lg">{orders.length}</p>
          </div>
        </div>

        <div className="hidden md:flex bg-white border border-bordercolor p-6 rounded-[2rem] shadow-sm items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
            <MdCheckCircle size={22} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-secondary/30 tracking-widest">Status</p>
            <p className="font-bold text-secondary text-sm truncate">
                {latestOrder?.status || "No Activity"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. LATEST ORDER CARD */}
      {latestOrder ? (
        <div className="bg-white border-2 border-accent/10 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-accent/5 relative overflow-hidden">
          {/* Visual glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4 flex-1 w-full">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1 bg-secondary text-white text-[10px] font-black uppercase rounded-full flex items-center gap-1.5">
                  <MdRadioButtonChecked className="animate-pulse text-accent" /> 
                  {latestOrder.status || "Latest Order"}
                </span>
                <span className="text-secondary/40 font-bold text-xs">#{latestOrder.orderID}</span>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight">
                  {latestOrder.items?.[0]?.name || "Order Details"}
                </h2>
                {latestOrder.items?.length > 1 && (
                  <p className="text-accent font-bold text-sm mt-1">
                    + {latestOrder.items.length - 1} other items in this order
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-5 text-sm font-bold text-secondary/60">
                <div className="flex items-center gap-2">
                  <MdOutlineTimer className="text-accent text-xl" /> 
                  <span>Placed: {new Date(latestOrder.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                   <span className="text-xs opacity-40">Total:</span> LKR {Number(latestOrder.total).toFixed(2)}
                </div>
              </div>

              {/* Status Bar */}
              <div className="mt-8">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-secondary/30 mb-3">
                  <span>Confirmed</span>
                  <span className={getProgress(latestOrder.status) >= 65 ? "text-accent" : ""}>Kitchen</span>
                  <span className={getProgress(latestOrder.status) === 100 ? "text-green-500" : ""}>Ready</span>
                </div>
                <div className="h-4 bg-primary/30 rounded-full overflow-hidden p-1">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(var(--color-accent),0.4)]" 
                    style={{ width: `${getProgress(latestOrder.status)}%` }} 
                  />
                </div>
              </div>
            </div>

            <Link to="/orders" className="w-full md:w-auto px-10 py-5 bg-secondary text-white font-black rounded-2xl hover:bg-accent transition-all active:scale-95 text-center shadow-lg hover:shadow-accent/30 flex items-center justify-center gap-2">
              <MdShoppingBag size={20}/>
              Order History
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-bordercolor rounded-[2.5rem] p-16 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-accent/40">
                <MdShoppingBag size={32} />
            </div>
          <h3 className="text-xl font-bold text-secondary">No orders found</h3>
          <p className="text-secondary/40 text-sm mt-2">Ready to eat? Start your first order now.</p>
          <Link to="/menu" className="mt-6 inline-block bg-accent text-white px-8 py-3 rounded-xl font-bold">Browse Menu</Link>
        </div>
      )}

      {/* 3. BOTTOM GRID */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Crowd Radar */}
        <div className="bg-secondary text-white p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
          <MdAccessTime size={160} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12" />
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">Crowd Radar</h3>
            <p className="text-white/50 text-xs mb-8 uppercase font-black tracking-widest">Canteen Traffic</p>
            
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10 inline-block w-full">
              <p className="text-[10px] uppercase font-black text-accent mb-2">Recommended Pickup</p>
              {bestSlot ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white italic">
                    {new Date(bestSlot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="text-white/40 font-bold">—</span>
                  <span className="text-3xl font-black text-white italic">
                    {new Date(bestSlot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              ) : (
                <span className="text-white/60 font-bold">Calculating optimal time...</span>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white border border-bordercolor p-8 rounded-[3rem] shadow-sm flex flex-col justify-between group">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-primary/50 rounded-2xl flex items-center justify-center text-accent">
              <MdStar size={30} />
            </div>
            <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-2xl font-black text-secondary mb-2">Rate your meal</h3>
            <p className="text-sm text-secondary/40 font-medium">
              We value your feedback to improve the kitchen efficiency.
            </p>
          </div>
          
          <Link 
            to="/feedback" 
            className="mt-8 flex items-center justify-between w-full p-5 bg-primary text-secondary rounded-2xl font-black hover:bg-accent hover:text-white transition-all shadow-sm group"
          >
            Leave a Review
            <MdChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
      </div>
    </div>
  );
}