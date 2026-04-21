import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaFilePdf,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaCalendarCheck,
  FaBan,
  FaSearch,
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Loder } from "../../components/loder";
import logo from "../../../public/logo.png";

export default function AdminSlotReportPage() {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const range = queryParams.get("range") || "7";
  const isValidRange = ["1", "7", "30"].includes(range);

  useEffect(() => {
    if (!isValidRange) {
      navigate("?range=7", { replace: true });
    }
  }, [isValidRange, navigate]);

  const fetchSlots = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      // Endpoint based on your provided backend routes
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/timeslots`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSlots(res.data);
    } catch (error) {
      toast.error("Failed to fetch time slots");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // Filter for display table (Search by date string)
  const filteredDisplaySlots = slots.filter((s) => {
    const dateStr = new Date(s.startTime).toDateString().toLowerCase();
    return dateStr.includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    if (!isLoading && slots.length > 0 && !hasAutoDownloaded) {
      generatePDFReport(parseInt(range));
      setHasAutoDownloaded(true);
    }
  }, [isLoading, range, slots, hasAutoDownloaded]);

  const generatePDFReport = (days) => {
    if (!slots || slots.length === 0) return;
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const today = new Date();
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        if (days > 1) startDate.setDate(today.getDate() - (days - 1));

        // Filter slots by range
        const filteredSlots = slots.filter(
          (s) => new Date(s.startTime) >= startDate,
        );

        const img = new Image();
        img.src = logo;

        img.onload = function () {
          // --- Header Section ---
          doc.setFillColor(34, 197, 94); // UniServe Green
          doc.rect(0, 0, 210, 45, "F");

          doc.addImage(img, "PNG", 15, 10, 15, 15);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(22);
          doc.setTextColor(255, 255, 255);
          doc.text("UniServe", 35, 20);

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text("University Canteen Management System", 35, 26);

          doc.setFontSize(8);
          doc.text("support@uniserve.com", 195, 15, { align: "right" });
          doc.text("011 452 3698", 195, 20, { align: "right" });

          // --- Title Section ---
          doc.setTextColor(31, 41, 55);
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text("TIME SLOT ANALYTICS REPORT", 15, 60);

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100);
          doc.text(
            `Timeline: Last ${days} Days | Generated: ${today.toLocaleDateString()}`,
            15,
            67,
          );

          // --- KPI Dashboard Cards ---
          // Total Slots
          doc.setFillColor(239, 246, 255);
          doc.roundedRect(15, 75, 58, 22, 2, 2, "F");
          doc.setFontSize(7);
          doc.setTextColor(29, 78, 216);
          doc.text("TOTAL SLOTS", 20, 81);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(`${filteredSlots.length} Records`, 20, 89);

          // Total Orders
          const totalOrders = filteredSlots.reduce(
            (acc, curr) => acc + curr.currentOrders,
            0,
          );
          doc.setFillColor(240, 253, 244);
          doc.roundedRect(76, 75, 58, 22, 2, 2, "F");
          doc.setFontSize(7);
          doc.setTextColor(21, 128, 61);
          doc.text("TOTAL ORDERS", 81, 81);
          doc.setFontSize(10);
          doc.text(`${totalOrders} Bookings`, 81, 89);

          // Closed/Full Slots
          const unavailable = filteredSlots.filter(
            (s) => s.status !== "Available",
          ).length;
          doc.setFillColor(254, 242, 242);
          doc.roundedRect(137, 75, 58, 22, 2, 2, "F");
          doc.setFontSize(7);
          doc.setTextColor(185, 28, 28);
          doc.text("UNAVAILABLE", 142, 81);
          doc.setFontSize(10);
          doc.text(`${unavailable} Full/Closed`, 142, 89);

          // --- Data Table ---
          autoTable(doc, {
            startY: 105,
            head: [["DATE", "TIME RANGE", "CAPACITY", "STATUS", "UTILIZATION"]],
            body: filteredSlots.map((s) => [
              new Date(s.startTime).toDateString().toUpperCase(),
              `${new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(s.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
              `${s.currentOrders} / ${s.maxCapacity}`,
              s.status.toUpperCase(),
              `${Math.round((s.currentOrders / s.maxCapacity) * 100)}%`,
            ]),
            theme: "striped",
            headStyles: {
              fillColor: [34, 197, 94],
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: 8,
              halign: "center",
            },
            bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
            columnStyles: {
              2: { halign: "center" },
              3: { halign: "center" },
              4: { halign: "right" },
            },
            didParseCell: function (data) {
              if (data.section === "body" && data.column.index === 3) {
                const status = data.cell.raw;
                if (status === "AVAILABLE") {
                  data.cell.styles.textColor = [21, 128, 61];
                } else {
                  data.cell.styles.textColor = [185, 28, 28];
                }
              }
            },
            margin: { left: 15, right: 15 },
          });

          // Footer
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(150);
            doc.text(
              `UniServe Management System - Page ${i} of ${pageCount}`,
              15,
              285,
            );
            doc.text(`Confidential - ${today.toLocaleString()}`, 195, 285, {
              align: "right",
            });
          }

          doc.save(`UniServe_Slot_Report_${days}d.pdf`);
          setShowSuccessModal(true);
          setIsGenerating(false);
        };
      } catch (err) {
        console.error(err);
        toast.error("PDF Generation Failed");
        setIsGenerating(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full p-6 md:p-8 bg-[#F8FAFC]">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl text-center max-w-sm w-full border border-slate-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Report Ready
            </h2>
            <p className="text-slate-500 mb-6 text-xs">
              Slot analytics have been exported successfully.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Slot Reports
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Analyze canteen crowd and slot efficiency.
            </p>
          </div>

          <div className="group relative">
            <button
              disabled={isGenerating}
              className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl font-bold text-slate-700 shadow-sm hover:border-emerald-500 transition-all"
            >
              {isGenerating ? (
                <FaSpinner className="animate-spin text-emerald-500" />
              ) : (
                <FaFilePdf className="text-rose-500" />
              )}
              <span className="text-xs uppercase tracking-wider">
                Export {range} Days
              </span>
              <IoChevronDown className="text-slate-400" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
              {[
                { l: "Today", v: "1" },
                { l: "Last 7 Days", v: "7" },
                { l: "Last 30 Days", v: "30" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => {
                    setHasAutoDownloaded(false);
                    navigate(`?range=${opt.v}`);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold ${range === opt.v ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Dashboard Stats */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl">
                <FaClock />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Slots
                </p>
                <p className="text-xl font-black text-slate-900">
                  {slots.length}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-xl">
                <FaCalendarCheck />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Bookings
                </p>
                <p className="text-xl font-black text-slate-900">
                  {slots.reduce((a, b) => a + b.currentOrders, 0)}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-xl">
                <FaBan />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Full/Closed
                </p>
                <p className="text-xl font-black text-slate-900">
                  {slots.filter((s) => s.status !== "Available").length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter / Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by Date (e.g. Mon Apr 06)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loder />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-5 px-8 text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                      Slot Timing
                    </th>
                    <th className="py-5 px-8 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-center">
                      Utilization
                    </th>
                    <th className="py-5 px-8 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDisplaySlots.length > 0 ? (
                    filteredDisplaySlots.map((s) => (
                      <tr
                        key={s._id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-5 px-8">
                          <p className="font-bold text-slate-800 text-sm">
                            {new Date(s.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(s.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {new Date(s.startTime).toDateString()}
                          </p>
                        </td>
                        <td className="py-5 px-8 text-center">
                          <p className="text-xs font-black text-slate-700">
                            {s.currentOrders} / {s.maxCapacity}
                          </p>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500"
                              style={{
                                width: `${(s.currentOrders / s.maxCapacity) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase ${s.status === "Available" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-20 text-center text-slate-400"
                      >
                        No slot data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
