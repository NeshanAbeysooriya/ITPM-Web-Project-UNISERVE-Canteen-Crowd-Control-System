import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf, FaCheckCircle, FaSpinner, FaStar } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Loder } from "../../components/loder";
import logo from "../../../public/logo.png";

export default function AdminFeedbackReportPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const range = queryParams.get("range");
  const isValidRange = range === "7" || range === "30";

  useEffect(() => {
    if (!isValidRange) {
      navigate("?range=30", { replace: true });
    }
  }, [isValidRange, navigate]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/feedback`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log("API RESPONSE", res.data);
        console.log("fIrst feedback", res.data[0]);

        setFeedbacks(res.data);
      } catch (error) {
        toast.error("Failed to fetch feedback data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (
      !isLoading &&
      isValidRange &&
      feedbacks.length > 0 &&
      !hasAutoDownloaded
    ) {
      generatePDFReport(parseInt(range));
      setHasAutoDownloaded(true);
    }
  }, [isLoading, range, feedbacks, hasAutoDownloaded]);

  const generatePDFReport = (days) => {
    if (!feedbacks || feedbacks.length === 0) {
      toast.error("No feedback available");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);

        const filtered = feedbacks.filter(
          (f) => new Date(f.createdAt) >= startDate,
        );

        const img = new Image();
        img.src = logo;

        img.onload = function () {
          // --- 1. TOP ACCENT BAR ---
          doc.setFillColor(34, 197, 94);
          doc.rect(0, 0, 210, 4, "F");

          // --- 2. BRANDED HEADER ---
          doc.addImage(img, "PNG", 14, 12, 12, 12);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(22);
          doc.setTextColor(31, 41, 55);
          doc.text("UniServe", 28, 22);

          // Contact Meta (Right Aligned)
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100);
          const rightAlign = 196;
          doc.text("Feedback & Quality Control", rightAlign, 15, {
            align: "right",
          });
          doc.setTextColor(34, 197, 94);
          doc.text("Phone: 011 452 3698", rightAlign, 20, { align: "right" });
          doc.text("Email: support@uniserve.com", rightAlign, 24, {
            align: "right",
          });
          doc.setTextColor(100);
          doc.text("Auto-Generated Report", rightAlign, 28, { align: "right" });

          // --- 3. COLORFUL SUMMARY CARDS ---
          const total = filtered.length;
          const highRating = filtered.filter((f) => f.rating >= 4).length;
          const lowRating = total - highRating;

          // Card 1: Total (Slate)
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(14, 40, 56, 25, 3, 3, "F");
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text("TOTAL REVIEWS", 19, 48);
          doc.setFontSize(14);
          doc.setTextColor(31, 41, 55);
          doc.text(`${total}`, 19, 58);

          // Card 2: Positive (Green)
          doc.setFillColor(220, 252, 231);
          doc.roundedRect(77, 40, 56, 25, 3, 3, "F");
          doc.setFontSize(8);
          doc.setTextColor(22, 101, 52);
          doc.text("POSITIVE (4-5*)", 82, 48);
          doc.setFontSize(14);
          doc.text(`${highRating}`, 82, 58);

          // Card 3: Critical (Red)
          doc.setFillColor(254, 226, 226);
          doc.roundedRect(140, 40, 56, 25, 3, 3, "F");
          doc.setFontSize(8);
          doc.setTextColor(153, 27, 27);
          doc.text("CRITICAL (1-3*)", 145, 48);
          doc.setFontSize(14);
          doc.text(`${lowRating}`, 145, 58);

          // --- 4. REPORT TITLE ---
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(31, 41, 55);
          doc.text("Customer Feedback Analytics", 14, 82);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(107, 114, 128);
          doc.text(`Timeline: Last ${days} Days Generation`, 14, 88);

          // --- 5. DATA TABLE (MATCHES USER REPORT STYLE) ---
          const tableRows = filtered.map((f) => [
            f.fullName.toUpperCase(),
            f.menuName,
            `${f.rating} / 5`,
            f.comment.substring(0, 45) + (f.comment.length > 45 ? "..." : ""),
            new Date(f.createdAt).toLocaleDateString(),
          ]);

          autoTable(doc, {
            startY: 95,
            head: [["CUSTOMER", "MENU ITEM", "RATING", "COMMENT", "DATE"]],
            body: tableRows,
            theme: "striped",
            headStyles: {
              fillColor: [31, 41, 55],
              textColor: [255, 255, 255],
              fontSize: 8,
              fontStyle: "bold",
              halign: "center",
            },
            bodyStyles: {
              fontSize: 8,
              textColor: [55, 65, 81],
              cellPadding: 5,
            },
            alternateRowStyles: { fillColor: [249, 250, 251] },
            columnStyles: {
              2: { halign: "center", fontStyle: "bold" },
              4: { halign: "center" },
            },
            didParseCell: function (data) {
              if (data.section === "body" && data.column.index === 2) {
                const rating = parseInt(data.cell.raw);
                if (rating >= 4)
                  data.cell.styles.textColor = [34, 197, 94]; // Green
                else if (rating <= 2)
                  data.cell.styles.textColor = [220, 38, 38]; // Red
              }
            },
          });

          // --- 6. FOOTER ---
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFillColor(241, 245, 249);
            doc.rect(0, 280, 210, 20, "F");
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(
              "UniServe Management System - Confidential Feedback Report",
              14,
              290,
            );
            doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: "right" });
          }

          doc.save(`UniServe_Feedback_Report_${days}d.pdf`);
          setShowSuccessModal(true);
        };
      } catch (err) {
        toast.error("PDF Generation failed");
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-[#F8FAFC]">
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full border border-slate-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Report Ready
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              Your {range}-day feedback analysis has been successfully exported.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Feedback Analytics
            </h1>
            <p className="text-slate-500">
              Monitor customer satisfaction metrics.
            </p>
          </div>

          <div className="group relative">
            <button
              disabled={isGenerating}
              className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <FaSpinner className="animate-spin text-emerald-500" />
              ) : (
                <FaFilePdf className="text-rose-500" />
              )}
              <span>
                {isGenerating
                  ? "Processing..."
                  : `Download ${range} Day Report`}
              </span>
              <IoChevronDown className="group-hover:rotate-180 transition-transform" />
            </button>

            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
              <button
                onClick={() => {
                  setHasAutoDownloaded(false);
                  navigate("?range=7");
                }}
                className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 text-slate-600"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => {
                  setHasAutoDownloaded(false);
                  navigate("?range=30");
                }}
                className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 text-slate-600"
              >
                Last 30 Days
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loder />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                      Customer
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase text-slate-400 tracking-wider text-center">
                      Item
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase text-slate-400 tracking-wider text-center">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feedbacks.map((f) => (
                    <tr
                      key={f._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <p className="font-bold text-slate-900 text-sm">
                            {f.fullName}
                          </p>
                          <p className="text-xs text-slate-400">{f.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
                          {f.menuName}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                          <FaStar size={12} /> {f.rating}
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
