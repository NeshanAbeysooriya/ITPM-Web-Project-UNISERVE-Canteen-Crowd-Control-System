import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
  User, 
  CreditCard, 
  Package, 
  X, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  FileText 
} from "lucide-react";

/* STATUS BADGE */
export const statusBadgeClass = (status) => {
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider";
  switch ((status || "").toLowerCase()) {
    case "completed": return `${base} bg-green-100 text-green-700 border border-green-200`;
    case "processing": return `${base} bg-blue-100 text-blue-700 border border-blue-200`;
    case "pending": return `${base} bg-amber-100 text-amber-700 border border-amber-200`;
    case "cancelled": return `${base} bg-red-100 text-red-700 border border-red-200`;
    default: return `${base} bg-gray-100 text-gray-600 border border-gray-200`;
  }
};

const formatLKR = (n) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(n ?? 0);

export default function OrderModal({ isModalOpen, selectedOrder, closeModal, refresh }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (selectedOrder) setStatus(selectedOrder.status);
  }, [selectedOrder]);

  if (!isModalOpen || !selectedOrder) return null;

  // Updated helper to format the Start and End time from the TimeSlot object
  const formatPickupTime = (timeValue) => {
    if (!timeValue) return "As soon as possible";
    
    // If it's a populated object from the TimeSlot model
    if (typeof timeValue === 'object' && timeValue.startTime && timeValue.endTime) {
      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
      const start = new Date(timeValue.startTime).toLocaleTimeString([], options);
      const end = new Date(timeValue.endTime).toLocaleTimeString([], options);
      return `${start} - ${end}`;
    }

    // Fallback logic for raw date strings
    try {
      const date = new Date(timeValue);
      if (isNaN(date.getTime())) return timeValue; 
      return date.toLocaleString([], { 
        weekday: 'short', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch (e) {
      return timeValue;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={closeModal}>
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              Order <span className="text-accent">#{selectedOrder.orderID}</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <span className={statusBadgeClass(selectedOrder.status)}>{selectedOrder.status}</span>
               <span className="text-gray-300">|</span>
               <div className="flex items-center gap-1 text-xs text-gray-500">
                 <Clock size={14} /> {new Date(selectedOrder.date).toLocaleString()}
               </div>
            </div>
          </div>
          <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 overflow-y-auto bg-gray-50/50">
          <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
            <div>
              <p className="text-emerald-100 text-xs font-medium uppercase mb-1">Total Bill</p>
              <p className="text-3xl font-black">{formatLKR(selectedOrder.total)}</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-xl text-right">
              <p className="text-xs font-medium">Basket Size</p>
              <p className="text-lg font-bold">{selectedOrder.items.length} Items</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-tight">
                <User size={18} className="text-accent" /> Customer Info
              </h3>
              <div className="space-y-4">
                <Row icon={<User size={14}/>} label="Name" value={selectedOrder.customerName} />
                <Row icon={<Mail size={14}/>} label="Email" value={selectedOrder.email} />
                <Row icon={<Phone size={14}/>} label="Phone" value={selectedOrder.phone} />
                
                <div className="pt-4 mt-2 border-t space-y-4">
                  {/* Notes mapping from 'address' field */}
                  <Row 
                    icon={<FileText size={14}/>} 
                    label="Pickup Notes" 
                    value={selectedOrder.address || "No special requests"} 
                  />

                  {/* PICKUP TIME - Now matches the Name/Email/Phone style exactly */}
                  <Row 
                    icon={<Clock size={14}/>} 
                    label="Pickup Time" 
                    value={formatPickupTime(selectedOrder.pickupTime)} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-tight">
                <CreditCard size={18} className="text-accent" /> Billing Detail
              </h3>
              <div className="space-y-4">
                <Row label="Subtotal" value={formatLKR(selectedOrder.total)} />
                <Row label="Tax (0%)" value={formatLKR(0)} />
                <div className="pt-2 border-t flex justify-between items-center font-black">
                  <span className="text-gray-900">Final Total</span>
                  <span className="text-xl text-emerald-600">{formatLKR(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Package size={18} className="text-accent" /> Items in Order</h3>
            <div className="grid gap-3">
              {selectedOrder.items.map((it) => (
                <div key={it.productID} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <img src={it.image} alt={it.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{it.name}</p>
                    <p className="text-xs text-gray-400">ID: {it.productID}</p>
                  </div>
                  <div className="text-right border-l pl-4 font-bold text-gray-900">
                    <p className="text-xs text-gray-400 font-normal">{it.quantity}x</p>
                    {formatLKR(it.price * it.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end items-center gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium outline-none cursor-pointer"
          >
            <option value="Pending">🟡 Pending</option>
            <option value="Preparing">🔵 Preparing</option>
            <option value="Ready">🟢 Ready</option>
            <option value="Cancelled">🔴 Cancelled</option>
          </select>
          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              axios.put(`${import.meta.env.VITE_API_URL}/api/orders/status/${selectedOrder.orderID}`, { status }, { headers: { Authorization: `Bearer ${token}` } })
              .then(() => {
                toast.success("Order status updated");
                closeModal();
                refresh();
              })
              .catch(() => toast.error("Update failed"));
            }}
            disabled={status === selectedOrder.status}
            className="px-8 py-2.5 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, icon }) {
  return (
    <div className="flex justify-between items-start text-sm">
      <div className="flex items-center gap-2 text-gray-400 font-medium">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      <span className="font-semibold text-gray-700 text-right ml-4">
        {value}
      </span>
    </div>
  );
}