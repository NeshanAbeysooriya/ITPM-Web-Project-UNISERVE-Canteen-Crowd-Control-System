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
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaSearch,
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Loder } from "../../components/loder";
import logo from "../../../public/logo.png";

export default function AdminUserReportPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

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

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/all-users`,
        { headers: { Authorization: `Bearer ${token}` } }
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

  const filteredDisplayUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = 
      roleFilter === "all" || 
      u.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  useEffect(() => {
    if (!isLoading && users.length > 0 && !hasAutoDownloaded) {
      generatePDFReport(parseInt(range));
      setHasAutoDownloaded(true);
    }
  }, [isLoading, range, users, hasAutoDownloaded]);

  const generatePDFReport = (days) => {
    if (!users || users.length === 0) return;
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const today = new Date();
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        if (days > 1) startDate.setDate(today.getDate() - (days - 1));

        const filteredUsers = users.filter((u) => new Date(u.createdAt || u.updatedAt) >= startDate);
        
        const img = new Image();
        img.src = logo;

        img.onload = function () {
          // --- Header Section (Matching Order Report) ---
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
          doc.text("USER ANALYTICS REPORT", 15, 60);
          
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100);
          doc.text(`Timeline: Last ${days} Days | Generated: ${today.toLocaleDateString()}`, 15, 67);

          // --- KPI Dashboard Cards ---
          // Total Members
          doc.setFillColor(239, 246, 255); 
          doc.roundedRect(15, 75, 58, 22, 2, 2, "F");
          doc.setFontSize(7);
          doc.setTextColor(29, 78, 216);
          doc.text("TOTAL MEMBERS", 20, 81);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(`${filteredUsers.length} Users`, 20, 89);

          // Active Members
          doc.setFillColor(240, 253, 244); 
          doc.roundedRect(76, 75, 58, 22, 2, 2, "F");
          doc.setFontSize(7);
          doc.setTextColor(21, 128, 61);
          doc.text("ACTIVE STATUS", 81, 81);
          doc.setFontSize(10);
          doc.text(`${filteredUsers.filter(u => !u.isBlock).length} Active`, 81, 89);

          // Restricted Members
          doc.setFillColor(254, 242, 242); 
          doc.roundedRect(137, 75, 58, 22, 2, 2, "F");
          doc.setFontSize(7);
          doc.setTextColor(185, 28, 28);
          doc.text("RESTRICTED", 142, 81);
          doc.setFontSize(10);
          doc.text(`${filteredUsers.filter(u => u.isBlock).length} Blocked`, 142, 89);

          // --- Data Table ---
          autoTable(doc, {
            startY: 105,
            head: [["NAME", "EMAIL", "ROLE", "STATUS", "JOINED"]],
            body: filteredUsers.map(u => [
              `${u.firstName} ${u.lastName}`.toUpperCase(),
              u.email,
              u.role?.toUpperCase() || "USER",
              u.isBlock ? "RESTRICTED" : "ACTIVE",
              new Date(u.createdAt || u.updatedAt).toLocaleDateString()
            ]),
            theme: "striped",
            headStyles: { 
              fillColor: [34, 197, 94], 
              textColor: [255, 255, 255], 
              fontStyle: 'bold',
              fontSize: 8,
              halign: 'center'
            },
            bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
            columnStyles: {
              3: { halign: 'center' },
              4: { halign: 'right' }
            },
            didParseCell: function (data) {
              if (data.section === 'body' && data.column.index === 3) {
                const status = data.cell.raw;
                if (status === 'ACTIVE') {
                  data.cell.styles.textColor = [21, 128, 61]; 
                } else if (status === 'RESTRICTED') {
                  data.cell.styles.textColor = [185, 28, 28];
                }
              }
            },
            margin: { left: 15, right: 15 }
          });

          // Footer
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(7);
            doc.setTextColor(150);
            doc.text(`UniServe Management System - Page ${i} of ${pageCount}`, 15, 285);
            doc.text(`Confidential - ${today.toLocaleString()}`, 195, 285, { align: "right" });
          }

          doc.save(`UniServe_User_Report_${days}d.pdf`);
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
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl text-center max-w-sm w-full border border-slate-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Report Generated</h2>
            <p className="text-slate-500 mb-6 text-xs">User analytics report is ready for review.</p>
            <button 
              onClick={() => setShowSuccessModal(false)} 
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 text-sm font-medium">Monitor registrations and user status.</p>
          </div>

          <div className="group relative">
            <button disabled={isGenerating} className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl font-bold text-slate-700 shadow-sm hover:border-emerald-500 transition-all">
              {isGenerating ? <FaSpinner className="animate-spin text-emerald-500" /> : <FaFilePdf className="text-rose-500" />}
              <span className="text-xs uppercase tracking-wider">Export {range} Days</span>
              <IoChevronDown className="text-slate-400" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
              {[
                { l: "Today", v: "1" },
                { l: "Last 7 Days", v: "7" },
                { l: "Last 30 Days", v: "30" }
              ].map((opt) => (
                <button 
                  key={opt.v}
                  onClick={() => { setHasAutoDownloaded(false); navigate(`?range=${opt.v}`); }} 
                  className={`w-full text-left px-4 py-2 text-xs font-bold ${range === opt.v ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>
        </header>

        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 cursor-default">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl">
                <FaUsers />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Users</p>
                <p className="text-xl font-black text-slate-900">{users.length}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-emerald-200 transition-all duration-300 transform hover:-translate-y-1 cursor-default">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-xl">
                <FaUserCheck />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</p>
                <p className="text-xl font-black text-slate-900">{users.filter(u => !u.isBlock).length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-rose-200 transition-all duration-300 transform hover:-translate-y-1 cursor-default">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-xl">
                <FaUserSlash />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Restricted</p>
                <p className="text-xl font-black text-slate-900">{users.filter(u => u.isBlock).length}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input 
              type="text" 
              placeholder="Search by Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {["all", "admin", "user"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  roleFilter === role 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {isLoading ? <div className="py-20 flex justify-center"><Loder /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-5 px-8 text-[10px] font-bold uppercase text-slate-500 tracking-widest">User Profile</th>
                    <th className="py-5 px-8 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-center">Designation</th>
                    <th className="py-5 px-8 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDisplayUsers.length > 0 ? (
                    filteredDisplayUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 px-8">
                          <p className="font-bold text-slate-800 text-sm">{u.firstName} {u.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                        </td>
                        <td className="py-5 px-8 text-center">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            {u.role || 'USER'}
                           </span>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase ${
                            !u.isBlock 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {!u.isBlock ? 'Active' : 'Restricted'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-20 text-center">
                        <p className="text-slate-400 font-medium">No users found.</p>
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