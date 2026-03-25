import React from "react";
import { 
  MdOutlineTimer, 
  MdCheckCircle, 
  MdAccessTime, 
  MdChevronRight, 
  MdStar, 
  MdTrendingUp, 
  MdFastfood 
} from "react-icons/md";
import { Link } from "react-router-dom";

export default function UserOverview() {
  // Mock Data (In a real app, fetch this from your context or API)
  const activeOrder = {
    id: "#ORD-7721",
    item: "Grilled Chicken Burger",
    status: "Preparing",
    progress: 65,
    pickupTime: "12:45 PM",
  };

  const stats = [
    { label: "Total Orders", value: "24", icon: <MdFastfood />, color: "bg-accent" },
    { label: "Reward Points", value: "1,250", icon: <MdTrendingUp />, color: "bg-secondary" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-bordercolor p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-secondary/30 tracking-widest">{stat.label}</p>
              <p className="font-bold text-secondary text-lg">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. ACTIVE ORDER CARD (The Main Focus) */}
      <div className="bg-white border-2 border-accent/20 rounded-[2.5rem] p-8 shadow-xl shadow-accent/5 relative overflow-hidden group">
        {/* Decorative Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-colors" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-accent text-white text-[9px] font-black uppercase rounded-full tracking-tighter">Live Order</span>
              <span className="text-secondary/30 font-bold text-xs">{activeOrder.id}</span>
            </div>
            <h2 className="text-3xl font-black text-secondary">{activeOrder.item}</h2>
            
            <div className="flex gap-6 text-sm font-bold text-secondary/60">
              <span className="flex items-center gap-1.5">
                <MdOutlineTimer className="text-accent text-lg" /> 
                Ready at {activeOrder.pickupTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MdCheckCircle className="text-green-500 text-lg" /> 
                {activeOrder.status}
              </span>
            </div>

            {/* Progress Tracking */}
            <div className="mt-6 max-w-md">
              <div className="flex justify-between text-[10px] font-black uppercase text-secondary/40 mb-2">
                <span>Ordered</span>
                <span>Preparing</span>
                <span>Ready</span>
              </div>
              <div className="h-3 bg-primary rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--color-accent),0.5)]" 
                  style={{ width: `${activeOrder.progress}%` }} 
                />
              </div>
            </div>
          </div>

          <Link to="/receipt" className="w-full md:w-auto px-8 py-4 bg-secondary text-white font-bold rounded-2xl hover:bg-secondary/90 transition-all active:scale-95 text-center shadow-lg shadow-secondary/20">
            Receipt
          </Link>
        </div>
      </div>

      {/* 3. BOTTOM GRID: CROWD RADAR & FEEDBACK */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Crowd Insights */}
        <div className="bg-secondary text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <MdAccessTime size={140} className="absolute -bottom-6 -right-6 text-white/5 rotate-12" />
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Crowd Radar</h3>
            <p className="text-white/60 text-sm mb-6 leading-relaxed max-w-[200px]">
              The canteen is currently <span className="text-highlight font-bold">Moderately Busy</span>.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
              <p className="text-[10px] uppercase font-black text-highlight mb-1">Best pickup window</p>
              <span className="text-2xl font-black text-white italic tracking-tight">
                1:15 <span className="text-highlight">PM</span> — 1:45 <span className="text-highlight">PM</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Review Card */}
        <div className="bg-white border border-bordercolor p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-accent mb-4">
              <MdStar size={28} />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">Rate your last meal</h3>
            <p className="text-sm text-secondary/50 font-medium">
              Your feedback helps us optimize the kitchen and reduce your future wait times!
            </p>
          </div>
          
          <Link 
            to="/dashboard/feedback" 
            className="mt-8 flex items-center justify-between w-full p-4 bg-primary rounded-2xl font-bold text-accent hover:bg-accent hover:text-white transition-all"
          >
            Leave a Review
            <MdChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
      </div>
    </div>
  );
}