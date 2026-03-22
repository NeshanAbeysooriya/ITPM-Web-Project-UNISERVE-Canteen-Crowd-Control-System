import React, { useState } from "react";
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
import { Link } from "react-router-dom";

// ── Modern Stat Card ──
const StatCard = ({ title, value, icon: Icon, color, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="relative overflow-hidden rounded-2xl bg-white border border-gray-200/70 shadow-lg shadow-gray-200/30 p-6 group"
  >
    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl opacity-10 ${color}`} />
    
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
          {title}
        </p>
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {value}
        </h3>
        {trend && (
          <p className={`mt-1 text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}% from yesterday
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
        <Icon size={24} strokeWidth={2} />
      </div>
    </div>
  </motion.div>
);

// ── COLORS for charts ──
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [isLoading] = useState(false); // ← change to true when you uncomment fetch

  // Mock data – replace with real API data later
  const summary = {
    todayOrders: 248,
    preOrders: 132,
    activeQueue: 41,
    peakHour: "12:00 - 13:00",
    vendorsCount: 18,
    menuItems: 143,
    pendingOrders: 37,
    completedOrders: 189,
    cancelledOrders: 22,
    avgWaitMin: 7.8,
    avgRating: 4.4,
    lowStockItems: 9,
  };

  const hourlyOrders = [
    { hour: "08", orders: 12 }, { hour: "09", orders: 28 },
    { hour: "10", orders: 45 }, { hour: "11", orders: 78 },
    { hour: "12", orders: 112 }, { hour: "13", orders: 95 },
    { hour: "14", orders: 64 }, { hour: "15", orders: 41 },
    { hour: "16", orders: 33 }, { hour: "17", orders: 19 },
  ];

  const orderStatusData = [
    { name: "Completed", value: summary.completedOrders },
    { name: "Pending", value: summary.pendingOrders },
    { name: "Cancelled", value: summary.cancelledOrders },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loder />
      </div>
    );
  }

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

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          title="Today's Orders"
          value={summary.todayOrders}
          icon={ShoppingCart}
          color="bg-green-600"
          trend={12}
          delay={0.1}
        />
        <StatCard
          title="Pre-Orders Today"
          value={summary.preOrders}
          icon={Clock}
          color="bg-blue-600"
          trend={8}
          delay={0.15}
        />
        <StatCard
          title="In Queue Now"
          value={summary.activeQueue}
          icon={Users}
          color="bg-amber-600"
          trend={-5}
          delay={0.2}
        />
        <StatCard
          title="Low Stock Alerts"
          value={summary.lowStockItems}
          icon={AlertCircle}
          color="bg-red-600"
          trend={3}
          delay={0.25}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Hourly Order Volume (Crowd Insight) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 lg:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <BarChart3 className="text-green-600" /> Order Volume by Hour
            </h3>
            <span className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Peak: {summary.peakHour}
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyOrders}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #d1d5db',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }} 
                />
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

        {/* Order Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 lg:p-8"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <TrendingUp className="text-blue-600" /> Order Status Today
          </h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: "Manage Vendors", count: summary.vendorsCount, link: "/admin/vendors", icon: UtensilsCrossed, color: "bg-emerald-100 text-emerald-700" },
          { label: "Menu Items", count: summary.menuItems, link: "/admin/menu", icon: ShoppingCart, color: "bg-blue-100 text-blue-700" },
          { label: "All Orders", count: summary.todayOrders, link: "/admin/orders", icon: Clock, color: "bg-amber-100 text-amber-700" },
          { label: "User Activity", count: "View", link: "/admin/users", icon: Users, color: "bg-purple-100 text-purple-700" },
          { label: "Feedback Monitor", count: `${summary.avgRating} ★`, link: "/admin/feedback", icon: MessageSquare, color: "bg-pink-100 text-pink-700" },
          { label: "Crowd & Queue", count: summary.activeQueue, link: "/admin/crowd", icon: BarChart3, color: "bg-cyan-100 text-cyan-700" },
        ].map((item, i) => (
          <Link to={item.link} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 flex items-center justify-between group hover:border-green-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {typeof item.count === 'number' ? `${item.count} items` : item.count}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-green-600 transition-colors" size={20} />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}