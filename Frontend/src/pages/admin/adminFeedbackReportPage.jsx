import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  IoClose,
  IoTrashOutline,
  IoStar,
  IoChevronDown,
} from "react-icons/io5";
import {
  FaFilePdf,
  FaCheckCircle,
  FaSpinner,
  FaSearch,
  FaCommentAlt,
  FaStarHalfAlt,
} from "react-icons/fa";
import { Loder } from "../../components/loder";
import logo from "../../../public/logo.png";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

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

  const fetchFeedbacks = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/feedback`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setFeedbacks(res.data);
    } catch (error) {
      toast.error("Failed to fetch feedbacks");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Filtering Logic
  const filteredDisplayFeedbacks = feedbacks.filter((f) => {
    const matchesSearch =
      f.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.menuName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      ratingFilter === "all" || f.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  // Auto-download Trigger
  useEffect(() => {
    if (!isLoading && feedbacks.length > 0 && !hasAutoDownloaded) {
      generatePDFReport(parseInt(range));
      setHasAutoDownloaded(true);
    }
  }, [isLoading, range, feedbacks, hasAutoDownloaded]);

  const generatePDFReport = (days) => {
    if (!feedbacks || feedbacks.length === 0) return;
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const today = new Date();
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        if (days > 1) startDate.setDate(today.getDate() - (days - 1));

        const filtered = feedbacks.filter(
          (f) => new Date(f.createdAt || f.updatedAt) >= startDate,
        );
        const avgRating = (
          filtered.reduce((acc, curr) => acc + curr.rating, 0) /
            filtered.length || 0
        ).toFixed(1);

        const img = new Image();
        img.src = logo;

        img.onload = function () {
          // Header
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

          // Title
          doc.setTextColor(31, 41, 55);
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text("CUSTOMER FEEDBACK REPORT", 15, 60);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100);
          doc.text(
            `Timeline: Last ${days} Days | Generated: ${today.toLocaleDateString()}`,
            15,
            67,
          );

          // KPI Cards
          doc.setFillColor(239, 246, 255);
          doc.roundedRect(15, 75, 58, 22, 2, 2, "F");
          doc.setFontSize(7);
          doc.setTextColor(29, 78, 216);
          doc.text("TOTAL REVIEWS", 20, 81);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(`${filtered.length} Feedbacks`, 20, 89);

          doc.setFillColor(255, 251, 235);
          doc.roundedRect(76, 75, 58, 22, 2, 2, "F");
          doc.setFontSize(7);
          doc.setTextColor(180, 83, 9);
          doc.text("AVG RATING", 81, 81);
          doc.setFontSize(10);
          doc.text(`${avgRating} / 5.0`, 81, 89);

          // Table
          autoTable(doc, {
            startY: 105,
            head: [["CUSTOMER", "MENU ITEM", "RATING", "COMMENT", "DATE"]],
            body: filtered.map((f) => [
              f.fullName.toUpperCase(),
              f.menuName,
              `${f.rating} Stars`,
              f.comment,
              new Date(f.createdAt || f.updatedAt).toLocaleDateString(),
            ]),
            theme: "striped",
            headStyles: { fillColor: [34, 197, 94], fontSize: 8 },
            bodyStyles: { fontSize: 7 },
            margin: { left: 15, right: 15 },
          });

          doc.save(`UniServe_Feedback_Report_${days}d.pdf`);
          setShowSuccessModal(true);
          setIsGenerating(false);
        };
      } catch (err) {
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
              The feedback analysis has been downloaded.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Feedback Management
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Analyze customer satisfaction and reviews.
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

        {/* KPI Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl">
                <FaCommentAlt />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Reviews
                </p>
                <p className="text-xl font-black text-slate-900">
                  {feedbacks.length}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl">
                <IoStar />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Avg Rating
                </p>
                <p className="text-xl font-black text-slate-900">
                  {(
                    feedbacks.reduce((acc, c) => acc + c.rating, 0) /
                      feedbacks.length || 0
                  ).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by Customer or Menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {["all", "5", "4", "3"].map((star) => (
              <button
                key={star}
                onClick={() => setRatingFilter(star)}
                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                  ratingFilter === star
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {star === "all" ? "All" : `${star} Stars`}
              </button>
            ))}
          </div>
        </div>

        {/* Table Section */}
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
                      Customer
                    </th>
                    <th className="py-5 px-8 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-center">
                      Menu Item
                    </th>
                    <th className="py-5 px-8 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-center">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDisplayFeedbacks.map((f) => (
                    <tr
                      key={f._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-5 px-8">
                        <p className="font-bold text-slate-800 text-sm">
                          {f.fullName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {f.email}
                        </p>
                      </td>
                      <td className="py-5 px-8 text-center">
                        <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase bg-amber-50 text-amber-600">
                          {f.menuName}
                        </span>
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex justify-center items-center gap-1 text-amber-500">
                          <IoStar />{" "}
                          <span className="text-slate-900 font-bold text-xs">
                            {f.rating}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
