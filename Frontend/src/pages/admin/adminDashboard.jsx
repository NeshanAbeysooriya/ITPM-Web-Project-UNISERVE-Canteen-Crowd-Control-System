import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  ShoppingCart,
  Clock,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Loder } from "../../components/loder";
import { Link, useNavigate } from "react-router-dom";
import { getSlots } from "../../api/timeslotApi.js"; // Adjust path as needed

// ── Modern Stat Card ──
const StatCard = ({ title, value, icon: Icon, color, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="relative overflow-hidden rounded-2xl bg-white border border-gray-200/70 shadow-lg shadow-gray-200/30 p-6 group"
  >
    <div
      className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl opacity-10 ${color}`}
    />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
          {title}
        </p>
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {value}
        </h3>
        {trend !== undefined && (
          <p
            className={`mt-1 text-sm font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend >= 0 ? "+" : ""}
            {trend}% active
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
        <Icon size={24} strokeWidth={2} />
      </div>
    </div>
  </motion.div>
);

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    orders: [],
    menuItems: [],
    slots: [],
    hourlyStats: [],
  });

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

        // Fetch Orders, Menu, and Slots in parallel
        const [ordersRes, menuRes, slotsRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API_URL + "/api/orders", config),
          axios.get(import.meta.env.VITE_API_URL + "/api/menus"),
          getSlots(),
        ]);

        const orders = ordersRes.data;

        // Process Hourly Data for Area Chart
        const hourlyMap = {};
        orders.forEach((order) => {
          const hour = new Date(order.date)
            .getHours()
            .toString()
            .padStart(2, "0");
          hourlyMap[hour] = (hourlyMap[hour] || 0) + 1;
        });

        const hourlyStats = Object.keys(hourlyMap)
          .sort()
          .map((hour) => ({
            hour,
            orders: hourlyMap[hour],
          }));

        setData({
          orders: orders,
          menuItems: menuRes.data.data || [],
          slots: slotsRes || [],
          hourlyStats: hourlyStats,
        });
      } catch (error) {
        console.error("Dashboard data fetch failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Derived Calculations
  const stats = {
    totalOrders: data.orders.length,
    pendingOrders: data.orders.filter(
      (o) => o.status?.toLowerCase().trim() === "pending",
    ).length,
    completedOrders: data.orders.filter(
      (o) => o.status?.toLowerCase().trim() === "completed",
    ).length,
    cancelledOrders: data.orders.filter(
      (o) => o.status?.toLowerCase().trim() === "cancelled",
    ).length,
    lowStock: data.menuItems.filter((item) => item.quantity < 10).length,
    activeQueue: data.slots.reduce((acc, s) => acc + (s.currentOrders || 0), 0),
    availableSlots: data.slots.filter((s) => s.status === "Available").length,
  };

  const orderStatusData = [
    { name: "Completed", value: stats.completedOrders },
    { name: "Pending", value: stats.pendingOrders },
    { name: "Cancelled", value: stats.cancelledOrders },
  ];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loder />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/70 p-5 md:p-8 lg:p-10">
      {/* Header */}

      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Canteen Control <span className="text-green-600">Center</span>
            </h1>

            <p className="mt-2 text-gray-600">
              Real-time overview • Vendors • Orders • Crowd
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Logged in as
              </p>

              <p className="text-sm font-bold text-green-700">Super Admin</p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-md">
              <LayoutDashboard size={24} />
            </div>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="bg-green-600"
          delay={0.1}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          color="bg-blue-600"
          delay={0.15}
        />
        <StatCard
          title="In Queue"
          value={stats.activeQueue}
          icon={Users}
          color="bg-amber-600"
          delay={0.2}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStock}
          icon={AlertCircle}
          color="bg-red-600"
          delay={0.25}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Real-time Order Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 lg:p-8"
        >
          <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 mb-6">
            <BarChart3 className="text-green-600" /> Hourly Order Traffic
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.hourlyStats}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  stroke="#6b7280"
                  fontSize={12}
                  label={{
                    value: "Hour",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 lg:p-8"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <TrendingUp className="text-blue-600" /> Order Fulfillment
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <QuickActionLink
          label="Manage Menu"
          count={data.menuItems.length}
          link="/admin/menu"
          icon={UtensilsCrossed}
          color="bg-emerald-100 text-emerald-700"
        />
        <QuickActionLink
          label="Order List"
          count={stats.totalOrders}
          link="/admin/orders"
          icon={ShoppingCart}
          color="bg-blue-100 text-blue-700"
        />
        <QuickActionLink
          label="Pickup Slots"
          count={stats.availableSlots}
          link="/admin/crowd"
          icon={Clock}
          color="bg-amber-100 text-amber-700"
        />

        <QuickActionLink
          label="User Activity"
          count={"View"}
          link="/admin/users"
          icon={Users}
          color="bg-purple-100 text-purple-700"
        />

        <QuickActionLink
          label="Feedback Monitor"
          count="No rating"
          link="/admin/feedback"
          icon={MessageSquare}
          color="bg-pink-100 text-pink-700"
        />
      </div>
    </div>
  );
}

function QuickActionLink({ label, count, link, icon: Icon, color }) {
  return (
    <Link to={link}>
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={24} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-sm text-gray-500">{count}</p>
          </div>
        </div>
        <ChevronRight
          className="text-gray-400 group-hover:text-green-600 transition-colors"
          size={20}
        />
      </motion.div>
    </Link>
  );
}
