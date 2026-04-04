import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Utensils,
  ShoppingBag,
  UsersRound,
  FileDown,
  Calendar,
  ArrowRight,
} from "lucide-react";


const AdminReports = () => {
  const [timeRange, setTimeRange] = useState(7);
  const navigate = useNavigate();

  // ✅ Route mapping (FIXED)
  const routeMap = {
    user: "users",
    feedback: "feedback",
    menu: "menu",
    order: "orders",
    crowd: "crowd",
  };

  // ✅ Navigation handler
  const handleGenerateReport = (moduleId) => {
    const path = routeMap[moduleId];
    if (!path) return;

    navigate(`/admin/reports/${path}?range=${timeRange}`);
  };

  const reportModules = [
    {
      id: "user",
      name: "User Management",
      desc: "Detailed breakdown of new registrations, user retention, and active session metrics.",
      icon: <Users />,
    },
    {
      id: "feedback",
      name: "Feedback Management",
      desc: "Analysis of customer ratings, reviews, and overall satisfaction sentiment.",
      icon: <MessageSquare />,
    },
    {
      id: "menu",
      name: "Menu Management",
      desc: "Performance tracking for dishes, category popularity, and seasonal updates.",
      icon: <Utensils />,
    },
    {
      id: "order",
      name: "Order Management",
      desc: "Revenue summaries, peak order times, and fulfillment efficiency reports.",
      icon: <ShoppingBag />,
    },
    {
      id: "crowd",
      name: "Crowd Management",
      desc: "Real-time occupancy trends, queue wait times, and peak flow analytics.",
      icon: <UsersRound />,
    },
  ];

  return (
    <div className="min-h-screen bg-primary p-6 md:p-12 text-secondary font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-sm">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Admin Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-black">
              System Reports
            </h1>
            <p className="text-gray-500 max-w-md">
              Extract professional PDF insights using our secure data generation
              engine.
            </p>
          </div>

          {/* Toggle (7 / 30 days) */}
          <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-bordercolor shadow-inner">
            {[7, 30].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  timeRange === days
                    ? "bg-accent text-white shadow-lg scale-105"
                    : "text-gray-400 hover:text-secondary"
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </header>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reportModules.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-bordercolor rounded-[2.5rem] p-8 transition-all duration-500 hover:border-accent hover:shadow-[0_20px_50px_rgba(34,197,94,0.1)] flex flex-col h-full overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                  <div className="p-4 bg-primary rounded-2xl text-highlight border border-bordercolor group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300 shadow-sm">
                    {item.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-tighter">
                      Status
                    </span>
                    <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                  {item.desc}
                </p>

                <button
                  onClick={() => handleGenerateReport(item.id)}
                  className="group/btn relative w-full overflow-hidden flex items-center justify-between px-6 py-4 bg-secondary text-white rounded-2xl font-bold transition-all hover:pr-4"
                >
                  <span className="flex items-center gap-2">
                    <FileDown
                      size={18}
                      className="group-hover/btn:animate-bounce"
                    />
                    Generate PDF
                  </span>
                  <ArrowRight
                    size={18}
                    className="opacity-0 group-hover/btn:opacity-100 transition-all transform translate-x-4 group-hover/btn:translate-x-0"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <footer className="mt-16 p-6 bg-secondary/5 border border-secondary/5 rounded-3xl flex items-center gap-6">
          <div className="hidden md:flex h-12 w-12 bg-white rounded-2xl items-center justify-center shadow-sm text-highlight shrink-0">
            <Calendar size={24} />
          </div>
          <div className="text-sm">
            <p className="text-secondary font-bold">Data Integrity Notice</p>
            <p className="text-gray-500">
              The generated report will strictly filter entries between
              <span className="text-secondary font-semibold mx-1">
                {new Date(
                  Date.now() - timeRange * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </span>
              and{" "}
              <span className="text-secondary font-semibold mx-1">
                Today
              </span>.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminReports;