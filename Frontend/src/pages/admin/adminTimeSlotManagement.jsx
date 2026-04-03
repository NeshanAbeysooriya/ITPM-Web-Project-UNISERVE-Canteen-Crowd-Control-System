import React from "react";
import { Calendar, CheckCircle, Clock } from "lucide-react";

export default function AdminTimeSlotManagement({ stats = {} }) {
  const cards = [
    {
      title: "Total Slots",
      value: stats?.total || 0,
      icon: <Calendar className="w-5 h-5 text-secondary" />,
      color: "bg-blue-50 border-blue-100",
    },
    {
      title: "Full Capacity",
      value: stats?.full || 0,
      icon: <CheckCircle className="w-5 h-5 text-accent" />,
      color: "bg-emerald-50 border-emerald-100",
    },
    {
      title: "Available",
      value: stats?.pending || 0,
      icon: <Clock className="w-5 h-5 text-highlight" />,
      color: "bg-amber-50 border-amber-100",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-secondary tracking-tight">
          Pickup Management
        </h1>
        <p className="text-slate-500 font-medium">Real-time capacity and schedule overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-3xl border bg-white shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${card.color}`}>
                {card.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-500 mb-1">{card.title}</h2>
              <p className="text-4xl font-black text-secondary">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}