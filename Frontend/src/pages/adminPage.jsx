import {
  Link,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import { MdShoppingCartCheckout, MdLogout } from "react-icons/md";
import { BsBox2Heart } from "react-icons/bs";
import { HiOutlineDocumentReport, HiOutlineUsers } from "react-icons/hi";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loder } from "../components/loder";
import AdminUsersPage from "./admin/adminUserPage";
import AdminDashboard from "./admin/adminDashboard";
import { VscFeedback } from "react-icons/vsc";
import { LuActivity } from "react-icons/lu";
import AdminFeedbackPage from "./admin/adminFeedbackPage";
import AdminMenuPage from "./admin/adminMenuPage";
import AddMenuPage from "./admin/adminAddNewMenu";
import UpdateMenuPage from "./admin/adminUpdateMenu";
import AdminOrdersPage from "./admin/adminOrdersPage";
import TimeSlotAdminPanel from "./admin/timeSlotAdminPanel";
import AdminReportPage from "./admin/adminReportPage";
import AdminUserReportPage from "./admin/adminUserReportPage";
import AdminFeedbackReportPage from "./admin/adminFeedbackReportPage";

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userLoaded, setUserLoaded] = useState(false);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("please login to access admin panel");
      navigate("/login");
      return;
    }

    axios
      .get(import.meta.env.VITE_API_URL + "/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.role !== "admin") {
          toast.error("You are not authorized to access admin panel");
          navigate("/");
          return;
        }
        setUserLoaded(true);
      })
      .catch(() => {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, [navigate]);

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen w-full bg-[var(--color-primary)] flex">
      {/* Sidebar – Desktop */}
      <aside className="hidden lg:flex lg:w-72 xl:w-80 flex-shrink-0 flex-col bg-white border-r border-[var(--color-bordercolor)] shadow-sm">
        {/* Logo & Title */}
        <div className="p-6 border-b border-[var(--color-bordercolor)]">
          <div className="flex items-center gap-3.5">
            <img
              src="/logo.png"
              alt="Canteen Logo"
              className="w-12 h-12 object-contain drop-shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--color-secondary)] tracking-tight">
                Admin Panel
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Canteen Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <Link
            to="/admin"
            className={`
              group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium transition-all duration-200
              ${
                currentPath === "/admin"
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm"
                  : "text-gray-700 hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-accent)]"
              }
            `}
          >
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                ${
                  currentPath === "/admin"
                    ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20"
                    : "bg-gray-100 text-gray-600 group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)]"
                }
              `}
            >
              <FaChartLine size={20} />
            </div>
            <span className="text-[15px]">Dashboard</span>
            {currentPath === "/admin" && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            )}
          </Link>

          <Link
            to="/admin/orders"
            className={`
              group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium transition-all duration-200
              ${
                currentPath === "/admin/orders"
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm"
                  : "text-gray-700 hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-accent)]"
              }
            `}
          >
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                ${
                  currentPath === "/admin/orders"
                    ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20"
                    : "bg-gray-100 text-gray-600 group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)]"
                }
              `}
            >
              <MdShoppingCartCheckout size={20} />
            </div>
            <span className="text-[15px]">Orders</span>
            {currentPath === "/admin/orders" && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            )}
          </Link>

          <Link
            to="/admin/menu"
            className={`
              group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium transition-all duration-200
              ${
                currentPath === "/admin/menu"
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm"
                  : "text-gray-700 hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-accent)]"
              }
            `}
          >
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                ${
                  currentPath === "/admin/menu"
                    ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20"
                    : "bg-gray-100 text-gray-600 group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)]"
                }
              `}
            >
              <BsBox2Heart size={20} />
            </div>
            <span className="text-[15px]">Menu Item</span>
            {currentPath === "/admin/menu" && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            )}
          </Link>

          <Link
            to="/admin/users"
            className={`
              group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium transition-all duration-200
              ${
                currentPath === "/admin/users"
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm"
                  : "text-gray-700 hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-accent)]"
              }
            `}
          >
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                ${
                  currentPath === "/admin/users"
                    ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20"
                    : "bg-gray-100 text-gray-600 group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)]"
                }
              `}
            >
              <HiOutlineUsers size={20} />
            </div>
            <span className="text-[15px]">Users</span>
            {currentPath === "/admin/users" && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            )}
          </Link>

          <Link
            to="/admin/crowd"
            className={`
              group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium transition-all duration-200
              ${
                currentPath === "/admin/crowd"
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm"
                  : "text-gray-700 hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-accent)]"
              }
            `}
          >
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                ${
                  currentPath === "/admin/crowd"
                    ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20"
                    : "bg-gray-100 text-gray-600 group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)]"
                }
              `}
            >
              <LuActivity size={20} />
            </div>
            <span className="text-[15px]">Crowd Controll</span>
            {currentPath === "/admin/crowd" && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            )}
          </Link>

          <Link
            to="/admin/feedback"
            className={`
              group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium transition-all duration-200
              ${
                currentPath === "/admin/feedback"
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm"
                  : "text-gray-700 hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-accent)]"
              }
            `}
          >
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                ${
                  currentPath === "/admin/feedback"
                    ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20"
                    : "bg-gray-100 text-gray-600 group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)]"
                }
              `}
            >
              <VscFeedback size={20} />
            </div>
            <span className="text-[15px]">Feedback</span>
            {currentPath === "/admin/feedback" && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            )}
          </Link>

          <Link
            to="/admin/report"
            className={`
              group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium transition-all duration-200
              ${
                currentPath === "/admin/report"
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-sm"
                  : "text-gray-700 hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-accent)]"
              }
            `}
          >
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
                ${
                  currentPath === "/admin/report"
                    ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20"
                    : "bg-gray-100 text-gray-600 group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)]"
                }
              `}
            >
              <HiOutlineDocumentReport size={20} />
            </div>
            <span className="text-[15px]">Report</span>
            {currentPath === "/admin/report" && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            )}
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-medium transition-all duration-200 text-red-600 hover:bg-red-50 mt-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-200">
              <MdLogout size={20} />
            </div>
            <span className="text-[15px]">Logout</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-bordercolor)] text-xs text-gray-500 font-medium">
          © {new Date().getFullYear()} Canteen System • v1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-[var(--color-bordercolor)] px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-[var(--color-secondary)]">
              Admin Panel
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-5 md:p-8 lg:p-10 overflow-y-auto bg-gradient-to-b from-[var(--color-primary)] to-white/40">
          {userLoaded ? (
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/menu" element={<AdminMenuPage />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              <Route path="/add-menu" element={<AddMenuPage />} />
              <Route path="/update-menu" element={<UpdateMenuPage />} />
              <Route path="/users" element={<AdminUsersPage />} />
              <Route path="/feedback" element={<AdminFeedbackPage />} />
              <Route path="/crowd" element={<TimeSlotAdminPanel />} />
              <Route path="/report" element={<AdminReportPage />} />

              {/* Individual Module Report Pages */}
              <Route path="/reports/users" element={<AdminUserReportPage />} />
              <Route path="/reports/feedback" element={<AdminFeedbackReportPage/>} />
              <Route path="/reports/menu" element={<h1>Menu</h1>} />
              <Route path="/reports/orders" element={<h1>Order</h1>} />
              <Route path="/reports/crowd" element={<h1>Crowd</h1>} />
            </Routes>
          ) : (
            <div className="h-[70vh] flex items-center justify-center">
              <Loder />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
