import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Clock, 
  PackageCheck, 
  CheckCircle2 
} from "lucide-react"; 
import { Loder } from "../../components/loder";
import OrderModal, { statusBadgeClass } from "../../components/orderInfoModel";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  const getOrders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(import.meta.env.VITE_API_URL + "/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setFilteredOrders(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    getOrders();
    const interval = setInterval(getOrders, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    let data = [...orders];

    if (statusFilter !== "all") {
      data = data.filter((o) => {
        const s = (o.status || "").toLowerCase().trim();
        if (statusFilter === "completed") return s === "completed" || s === "ready";
        if (statusFilter === "processing") return s === "processing" || s === "preparing";
        return s === statusFilter;
      });
    }

    if (search.trim()) {
      data = data.filter(
        (o) =>
          o.orderID?.toString().includes(search) ||
          o.customerName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredOrders(data);
  }, [search, statusFilter, orders]);

  const totalOrders = orders.length;
  
  const pending = orders.filter(o => (o.status || "").toLowerCase().trim() === "pending").length;
  const preparing = orders.filter(o => {
    const s = (o.status || "").toLowerCase().trim();
    return s === "preparing" || s === "processing";
  }).length;
  const ready = orders.filter(o => {
    const s = (o.status || "").toLowerCase().trim();
    return s === "ready" || s === "completed";
  }).length;

  return (
    <div className="w-full min-h-screen p-8 bg-[#F8FAFC]">
      <OrderModal
        isModalOpen={isModelOpen}
        selectedOrder={selectedOrder}
        closeModal={() => setIsModelOpen(false)}
        refresh={getOrders}
      />

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Order Management</h1>
        <p className="text-slate-500 mt-2 font-medium">Manage, track and update all customer orders in real-time</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Orders" value={totalOrders} icon={<ShoppingBag size={20}/>} color="border-b-4 border-b-slate-400" />
        <StatCard title="Pending" value={pending} icon={<Clock size={20}/>} color="bg-amber-50 border-b-4 border-b-amber-400" textColor="text-amber-700" />
        <StatCard title="Preparing" value={preparing} icon={<PackageCheck size={20}/>} color="bg-blue-50 border-b-4 border-b-blue-400" textColor="text-blue-700" />
        <StatCard title="Ready" value={ready} icon={<CheckCircle2 size={20}/>} color="bg-emerald-50 border-b-4 border-b-emerald-400" textColor="text-emerald-700" />
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer font-medium"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Preparing</option> 
          <option value="completed">Ready</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex justify-center"><Loder /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] uppercase font-bold tracking-widest">
                  <th className="py-5 px-8">Order</th>
                  <th className="py-5 px-6">Customer</th>
                  <th className="py-5 px-6 text-center">Items</th>
                  <th className="py-5 px-6">Total</th>
                  <th className="py-5 px-6">Status</th>
                  <th className="py-5 px-6 text-right pr-8">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((item) => {
                  const s = (item.status || "").toLowerCase().trim();
                  
                  // This section ensures the correct string is sent to the styling function
                  let statusForStyling = "";
                  let displayStatus = "";

                  if (s === "pending") {
                    statusForStyling = "PENDING";
                    displayStatus = "PENDING";
                  } else if (s === "processing" || s === "preparing") {
                    statusForStyling = "PROCESSING"; // Using the value your CSS likely expects
                    displayStatus = "PREPARING";
                  } else if (s === "completed" || s === "ready") {
                    statusForStyling = "COMPLETED"; // Using the value your CSS likely expects
                    displayStatus = "READY";
                  } else {
                    statusForStyling = s.toUpperCase();
                    displayStatus = s.toUpperCase();
                  }

                  return (
                    <tr
                      key={item.orderID}
                      onClick={() => { setSelectedOrder(item); setIsModelOpen(true); }}
                      className="group hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <td className="py-5 px-8 font-bold text-slate-900 group-hover:text-accent">#{item.orderID}</td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{item.customerName}</span>
                          <span className="text-xs text-slate-400 font-medium">{item.phone}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                          {item.items?.length || 0}
                        </span>
                      </td>
                      <td className="py-5 px-6 font-bold text-slate-900">LKR {item.total}</td>
                      <td className="py-5 px-6">
                        <span className={statusBadgeClass(statusForStyling)}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right pr-8 text-sm font-bold text-slate-700">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color, textColor = "text-slate-900", icon }) {
  return (
    <div className={`${color} p-6 rounded-3xl bg-white shadow-sm border border-slate-100 flex items-center justify-between`}>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${textColor}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-2xl ${textColor} bg-white/50`}>{icon}</div>
    </div>
  );
}