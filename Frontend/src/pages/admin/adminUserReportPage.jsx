import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom"; // Add useLocation
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminUserReportPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ ADD THIS HERE (DATA FETCHING)
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 1. Listen for the report trigger from the Dashboard
  useEffect(() => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const reportDays = queryParams.get("range");

      if (
        !isLoading &&
        reportDays &&
        Array.isArray(users) &&
        users.length > 0
      ) {
        generatePDFReport(parseInt(reportDays));
      }
    } catch (error) {
      console.error("Report page error:", error);
    }
  }, [isLoading, users, location.search]);

  // 2. Updated PDF Generator with Logo (UniServer)
  const generatePDFReport = (days) => {
    const doc = new jsPDF();
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    const filteredUsers = users.filter((user) => {
      const userDate = new Date(user.createdAt || Date.now());
      return userDate >= startDate && userDate <= today;
    });

    // Branding
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55);
    doc.text("UniServer", 14, 20); // Your site name

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`User Management Report: Last ${days} Days`, 14, 28);
    doc.text(
      `Range: ${startDate.toLocaleDateString()} - ${today.toLocaleDateString()}`,
      14,
      33,
    );

    const tableRows = filteredUsers.map((user) => [
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.role.toUpperCase(),
      user.isBlock ? "Blocked" : "Active",
      new Date(user.createdAt || Date.now()).toLocaleDateString(),
    ]);

    doc.autoTable({
      startY: 40,
      head: [["Full Name", "Email Address", "Role", "Status", "Joined Date"]],
      body: tableRows,
      headStyles: { fillColor: [34, 197, 94] }, // Fresh Green
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`UniServer_Users_${days}Days.pdf`);
    toast.success(`${days} Day Report Generated`);
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-[#F8FAFC]">
      {/* ... (Your existing Modal logic) ... */}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              User Management
            </h1>
            <p className="text-slate-500 mt-1">
              Manage permissions and view system analytics.
            </p>
          </div>

          {/* REPORT GENERATION BUTTONS */}
          <div className="flex items-center gap-2">
            <div className="group relative">
              <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <FaFilePdf className="text-rose-500" />
                Generate Report
                <IoChevronDown className="group-hover:rotate-180 transition-transform" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <button
                  onClick={() => generatePDFReport(7)}
                  className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-colors border-b border-slate-50"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => generatePDFReport(30)}
                  className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  Last 30 Days
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ... (Rest of your table code) ... */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loder />
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Table remains as you had it */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
