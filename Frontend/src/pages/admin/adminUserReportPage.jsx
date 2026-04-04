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
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import { IoChevronDown, IoClose } from "react-icons/io5";
import { MdOutlineAdminPanelSettings, MdVerified } from "react-icons/md";
import { Loder } from "../../components/loder";
import logo from "../../../public/logo.png";

export default function AdminUserReportPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false); // Prevents infinite loop

  const location = useLocation();
  const navigate = useNavigate();

  // 1. Strict Restriction Logic
  const queryParams = new URLSearchParams(location.search);
  const range = queryParams.get("range");
  const isValidRange = range === "7" || range === "30";

  useEffect(() => {
    // If the URL is just /admin/reports/users without a valid range, kick them out or default them
    if (!isValidRange) {
      toast.error("Invalid range selected. Defaulting to 7 days.");
      navigate("?range=7", { replace: true });
    }
  }, [isValidRange, navigate]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/all-users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Controlled Auto-Download Logic
  useEffect(() => {
    if (!isLoading && isValidRange && users.length > 0 && !hasAutoDownloaded) {
      generatePDFReport(parseInt(range));
      setHasAutoDownloaded(true); // Mark as done so it doesn't trigger again on re-renders
    }
  }, [isLoading, range, users, hasAutoDownloaded]);

  const generatePDFReport = (days) => {
    if (!users || users.length === 0) {
      toast.error("No users available to generate report");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);

        const filteredUsers = users.filter((u) => {
          const date = new Date(u.createdAt || u.updatedAt);
          return date >= startDate;
        });

        const img = new Image();
        img.src = logo;

        img.onload = function () {
          // --- 1. COLORFUL TOP ACCENT BAR ---
          doc.setFillColor(34, 197, 94); // UniServe Accent Green (#22C55E)
          doc.rect(0, 0, 210, 4, "F");

          // --- 2. BRANDED HEADER ---
          doc.addImage(img, "PNG", 14, 12, 12, 12);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(22);
          doc.setTextColor(31, 41, 55); // secondary (#1F2937)
          doc.text("UniServe", 28, 22);

          // --- 3. CONTACT INFO (CLEAN & COLORED) ---
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100);
          const rightAlign = 196;
          doc.text("User Activity", rightAlign, 15, { align: "right" });
          doc.setTextColor(34, 197, 94); // Green accent for contact
          doc.text("Phone: 011 452 3698", rightAlign, 20, { align: "right" });
          doc.text("Email: support@uniserve.com", rightAlign, 24, {
            align: "right",
          });
          doc.setTextColor(100);
          doc.text("Auto-Generated Report", rightAlign, 28, {
            align: "right",
          });

          // --- 4. CATEGORIZED SUMMARY CARDS (COLORFUL BOXES) ---
          const total = filteredUsers.length;
          const active = filteredUsers.filter((u) => !u.isBlock).length;
          const blocked = total - active;

          // Card 1: Total (Soft Blue/Slate)
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(14, 40, 56, 25, 3, 3, "F");
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text("TOTAL MEMBERS", 19, 48);
          doc.setFontSize(14);
          doc.setTextColor(31, 41, 55);
          doc.text(`${total}`, 19, 58);

          // Card 2: Active (Soft Green)
          doc.setFillColor(220, 252, 231);
          doc.roundedRect(77, 40, 56, 25, 3, 3, "F");
          doc.setFontSize(8);
          doc.setTextColor(22, 101, 52);
          doc.text("ACTIVE USERS", 82, 48);
          doc.setFontSize(14);
          doc.text(`${active}`, 82, 58);

          // Card 3: Blocked (Soft Red)
          doc.setFillColor(254, 226, 226);
          doc.roundedRect(140, 40, 56, 25, 3, 3, "F");
          doc.setFontSize(8);
          doc.setTextColor(153, 27, 27);
          doc.text("RESTRICTED", 145, 48);
          doc.setFontSize(14);
          doc.text(`${blocked}`, 145, 58);

          // --- 5. REPORT TITLE ---
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(31, 41, 55);
          doc.text("Detailed User Analytics Report", 14, 82);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(107, 114, 128);
          doc.text(`Timeline: Last ${days} Days Generation`, 14, 88);

          // --- 6. MODERN TABLE (PINTEREST STYLE) ---
          const tableRows = filteredUsers.map((u) => [
            `${u.firstName || ""} ${u.lastName || ""}`.toUpperCase(),
            u.email || "N/A",
            (u.role || "USER").toUpperCase(),
            u.isBlock ? "RESTRICTED" : "ACTIVE",
            new Date(u.createdAt || u.updatedAt).toLocaleDateString(),
          ]);

          autoTable(doc, {
            startY: 95,
            head: [["NAME", "EMAIL", "DESIGNATION", "STATUS", "JOINED"]],
            body: tableRows,
            theme: "striped",
            headStyles: {
              fillColor: [31, 41, 55], // secondary
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
            alternateRowStyles: {
              fillColor: [249, 250, 251], // very light grey
            },
            columnStyles: {
              3: { halign: "center", fontStyle: "bold" },
              4: { halign: "center" },
            },
            didParseCell: function (data) {
              // Apply colorful text for status column
              if (data.section === "body" && data.column.index === 3) {
                if (data.cell.raw === "RESTRICTED") {
                  data.cell.styles.textColor = [220, 38, 38]; // Red
                } else {
                  data.cell.styles.textColor = [34, 197, 94]; // Green accent
                }
              }
            },
          });

          // --- 7. COLORFUL FOOTER ---
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            // Bottom Accent line
            doc.setFillColor(241, 245, 249);
            doc.rect(0, 280, 210, 20, "F");

            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text("UniServe Management System - Confidential", 14, 290);
            doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: "right" });
          }

          doc.save(`UniServe_User_Report_${days}d.pdf`);
          setShowSuccessModal(true);
        };
      } catch (err) {
        console.error(err);
        toast.error("PDF Generation failed");
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-[#F8FAFC]">
      {/* SUCCESS MODAL */}
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
              Your {range}-day user report has been generated successfully.
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
              User Analytics
            </h1>
            <p className="text-slate-500">View and export community data.</p>
          </div>

          {/* DROP-DOWN BUTTON */}
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

            {/* Range Selection Dropdown */}
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
              <button
                onClick={() => {
                  setHasAutoDownloaded(false);
                  navigate("?range=7");
                }}
                className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 ${range === "7" ? "text-emerald-600" : "text-slate-600"}`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => {
                  setHasAutoDownloaded(false);
                  navigate("?range=30");
                }}
                className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 ${range === "30" ? "text-emerald-600" : "text-slate-600"}`}
              >
                Last 30 Days
              </button>
            </div>
          </div>
        </header>

        {/* DATA TABLE */}
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
                      Member
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase text-slate-400 tracking-wider text-center">
                      Role
                    </th>
                    <th className="py-4 px-6 text-[11px] font-bold uppercase text-slate-400 tracking-wider text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr
                      key={user.email}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.image}
                            className="w-10 h-10 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto ${user.isBlock ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}
                        >
                          {user.isBlock ? <FaLock /> : <FaLockOpen />}
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
