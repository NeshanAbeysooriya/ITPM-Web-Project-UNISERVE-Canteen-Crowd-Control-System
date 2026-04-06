import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { FaFilePdf, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { Loder } from "../../components/loder";
import logo from "../../../public/logo.png";

const formatLKR = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(value ?? 0);

export default function AdminMenuReportPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const range = queryParams.get("range") || "1";
  const isValidRange = ["1", "7", "30"].includes(range);
  const rangeOptions = [
    { value: "1", label: "Daily" },
    { value: "7", label: "Weekly" },
    { value: "30", label: "Monthly" },
  ];

  useEffect(() => {
    if (!isValidRange) {
      navigate("?range=1", { replace: true });
    }
  }, [isValidRange, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [menuRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/menus`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMenuItems(menuRes.data.data || []);
        setOrders(ordersRes.data || []);
      } catch (error) {
        toast.error("Failed to load menu report data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredOrders = (days) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);
    if (days > 1) startDate.setDate(today.getDate() - (days - 1));

    return orders.filter((order) => new Date(order.date) >= startDate);
  };

  const summarizeReport = (filteredOrders) => {
    const dailySales = {};
    const dailyRevenue = {};
    const dailyItems = {};
    const itemQuantity = {};
    const menuIndex = new Map();
    let totalRevenue = 0;
    let totalItemsSold = 0;

    menuItems.forEach((menu) => {
      const name = menu.name || menu.menuName || "Unnamed";
      const key = menu._id || menu.id || menu.productID || name;
      const stats = {
        name,
        category: menu.category || "N/A",
        price: menu.price ?? 0,
        remainingStock: menu.quantity ?? 0,
        status: menu.quantity === 0 ? "Sold Out" : "Available",
        soldQty: 0,
      };
      menuIndex.set(key, stats);
      if (!menuIndex.has(name)) {
        menuIndex.set(name, stats);
      }
    });

    filteredOrders.forEach((order) => {
      const dateKey = new Date(order.date).toLocaleDateString();
      const orderItems = Array.isArray(order.items) ? order.items : [];
      const orderItemCount = orderItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
      );
      const orderRevenue =
        order.total ||
        orderItems.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
          0,
        );

      totalItemsSold += orderItemCount;
      totalRevenue += orderRevenue;
      dailySales[dateKey] = (dailySales[dateKey] || 0) + orderItemCount;
      dailyRevenue[dateKey] = (dailyRevenue[dateKey] || 0) + orderRevenue;
      dailyItems[dateKey] = dailyItems[dateKey] || [];

      orderItems.forEach((item) => {
        const itemName = item.name || item.menuName || "Unknown item";
        itemQuantity[itemName] =
          (itemQuantity[itemName] || 0) + (item.quantity || 0);

        dailyItems[dateKey].push({
          name: itemName,
          quantity: item.quantity || 0,
          price: item.price || 0,
        });

        const matchKey = item.productID || item._id || item.id || itemName;
        const menuStat = menuIndex.get(matchKey) || menuIndex.get(itemName);
        if (menuStat) {
          menuStat.soldQty += item.quantity || 0;
        }
      });
    });

    const mostPopularItem = Object.entries(itemQuantity).sort(
      (a, b) => b[1] - a[1],
    )[0] || ["N/A", 0];
    const soldOutItems = menuItems
      .filter((menu) => menu.quantity === 0)
      .map((menu) => menu.name || menu.menuName || "Unnamed item");
    const remainingStock = menuItems.reduce(
      (sum, menu) => sum + (menu.quantity || 0),
      0,
    );

    const menuStats = Array.from(new Set(menuIndex.values()));

    return {
      totalItemsSold,
      totalRevenue,
      mostPopular: mostPopularItem,
      soldOutItems,
      remainingStock,
      dailySales,
      dailyRevenue,
      dailyItems,
      menuStats,
    };
  };

  useEffect(() => {
    if (!isLoading && !isValidRange) {
      navigate("?range=1", { replace: true });
    }
  }, [isLoading, isValidRange, navigate]);

  const generatePDFReport = (days) => {
    if (!orders.length || !menuItems.length) {
      toast.error("Not enough data to generate menu report");
      return;
    }

    setIsGenerating(true);
    const filteredOrders = getFilteredOrders(days);
    const report = summarizeReport(filteredOrders);
    const today = new Date();

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const img = new Image();
        img.src = logo;

        img.onload = function () {
          // Enhanced Header with Gradient Effect
          doc.setFillColor(25, 135, 84);
          doc.rect(0, 0, 210, 50, "F");
          doc.setFillColor(34, 197, 94);
          doc.rect(0, 40, 210, 10, "F");

          doc.addImage(img, "PNG", 15, 10, 16, 16);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(24);
          doc.setTextColor(255, 255, 255);
          doc.text("UniServe", 36, 24);

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(230, 245, 235);
          doc.text(
            "University Canteen Management System",
            36,
            31,
          );
          
          doc.setFontSize(8);
          doc.setTextColor(200, 230, 201);
          doc.text(
            `Report Generated: ${today.toLocaleDateString()} - ${today.toLocaleTimeString()}`,
            15,
            40,
          );

          // Decorative Line
          doc.setDrawColor(34, 197, 94);
          doc.setLineWidth(0.5);
          doc.line(15, 58, 195, 58);

          doc.setTextColor(22, 101, 52);
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          const reportTitle =
            days === 1
              ? "Menu Daily Summary Report"
              : days === 7
              ? "Menu Weekly Summary Report"
              : "Menu Monthly Summary Report";
          doc.text(reportTitle, 15, 68);

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 120, 100);
          const startDate = new Date(today);
          if (days > 1) startDate.setDate(today.getDate() - (days - 1));
          doc.text(
            `Period: ${startDate.toLocaleDateString()} - ${today.toLocaleDateString()} (${days} days)`,
            15,
            76
          );

          const cardTop = 84;
          const cardWidth = 43;
          const cardHeight = 28;
          const cardSpacing = 48;

          const createCard = (x, label, value, bgColor, borderColor) => {
            doc.setFillColor(...bgColor);
            doc.roundedRect(x, cardTop, cardWidth, cardHeight, 2, 2, "F");
            
            doc.setDrawColor(...borderColor);
            doc.setLineWidth(0.8);
            doc.roundedRect(x, cardTop, cardWidth, cardHeight, 2, 2);
            
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(60, 90, 80);
            doc.text(label, x + 3, cardTop + 6);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(20, 80, 50);
            doc.text(value, x + 3, cardTop + 18);
          };

          createCard(15, "Items Sold", `${report.totalItemsSold}`, [225, 245, 235], [34, 197, 94]);
          createCard(61, "Top Item", `${report.mostPopular[0]}`, [232, 243, 255], [59, 130, 246]);
          createCard(107, "Stock", `${report.remainingStock}`, [255, 245, 225], [251, 146, 60]);
          createCard(153, "Sold-Out", `${report.soldOutItems.length}`, [255, 237, 237], [239, 68, 68]);
          
          // Revenue Card - Larger
          doc.setFillColor(240, 253, 250);
          doc.setDrawColor(16, 185, 129);
          doc.setLineWidth(1);
          doc.roundedRect(15, 116, 186, 20, 2, 2, "F");
          doc.roundedRect(15, 116, 186, 20, 2, 2);
          
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 120, 100);
          doc.text("Total Revenue", 20, 122);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(16, 185, 129);
          doc.text(formatLKR(report.totalRevenue), 190, 122, { align: "right" });

          const rows = Object.entries(report.dailySales).map(([day, count]) => {
            const itemsList = report.dailyItems[day]
              ? report.dailyItems[day].map((i) => `${i.name} (${i.quantity})`).join(", ")
              : "N/A";
            return [day, itemsList, `${count}`, formatLKR(report.dailyRevenue[day] || 0)];
          });

          // Daily Sales Section Title
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(22, 101, 52);
          doc.text("Daily Sales Breakdown", 15, 142);

          autoTable(doc, {
            startY: 148,
            head: [["DATE", "ITEMS SOLD", "TOTAL COUNT", "REVENUE"]],
            body: rows.length ? rows : [["No data", "N/A", "0", formatLKR(0)]],
            theme: "grid",
            headStyles: {
              fillColor: [34, 197, 94],
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: 9,
              halign: "center",
              valign: "middle",
              padding: 4,
            },
            bodyStyles: {
              fontSize: 8,
              textColor: [45, 55, 72],
              cellPadding: 3.5,
              valign: "top",
            },
            alternateRowStyles: {
              fillColor: [245, 253, 250],
            },
            columnStyles: {
              0: { cellWidth: 28, halign: "center", fontStyle: "bold" },
              1: { cellWidth: 95 },
              2: { halign: "center", cellWidth: 28, fontStyle: "bold", textColor: [34, 197, 94] },
              3: { halign: "right", cellWidth: 35, fontStyle: "bold", textColor: [16, 185, 129] },
            },
            margin: { left: 15, right: 15 },
            lineColor: [34, 197, 94],
            lineWidth: 0.5,
          });

          const currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 170;
          
          // Decorative Line
          doc.setDrawColor(34, 197, 94);
          doc.setLineWidth(0.5);
          doc.line(15, currentY - 2, 195, currentY - 2);
          
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(22, 101, 52);
          doc.text("Menu-wise Summary", 15, currentY + 4);

          const menuRows = report.menuStats.map((menu) => [
            menu.name,
            menu.category,
            `Rs.${menu.price.toFixed(2)}`,
            `${menu.soldQty}`,
            `${menu.remainingStock}`,
            menu.status,
          ]);

          autoTable(doc, {
            startY: currentY + 10,
            head: [["NAME", "CATEGORY", "PRICE", "SOLD", "STOCK", "STATUS"]],
            body: menuRows,
            theme: "grid",
            headStyles: {
              fillColor: [59, 130, 246],
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: 9,
              halign: "center",
              valign: "middle",
              padding: 4,
            },
            bodyStyles: {
              fontSize: 8,
              textColor: [45, 55, 72],
              cellPadding: 3.5,
            },
            alternateRowStyles: {
              fillColor: [239, 246, 255],
            },
            columnStyles: {
              0: { cellWidth: 48, fontStyle: "bold" },
              1: { cellWidth: 32, halign: "center" },
              2: { halign: "right", cellWidth: 26, textColor: [34, 197, 94], fontStyle: "bold" },
              3: { halign: "center", cellWidth: 20, textColor: [59, 130, 246], fontStyle: "bold" },
              4: { halign: "center", cellWidth: 20, textColor: [251, 146, 60], fontStyle: "bold" },
              5: { halign: "center", cellWidth: 28 },
            },
            margin: { left: 15, right: 15 },
            lineColor: [200, 210, 220],
            lineWidth: 0.4,
            pageBreak: "auto",
          });

          const footerText = report.soldOutItems.length
            ? `Sold Out Items: ${report.soldOutItems.join(", ")}`
            : "No sold out menu items during this interval.";

          // Beautiful Footer Section
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i += 1) {
            doc.setPage(i);

            // Decorative footer line
            doc.setDrawColor(34, 197, 94);
            doc.setLineWidth(0.5);
            doc.line(15, doc.internal.pageSize.height - 28, 195, doc.internal.pageSize.height - 28);

            // Sold out items info
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(60, 90, 80);
            doc.text(footerText, 15, doc.internal.pageSize.height - 22);

            // Page footer with enhanced styling
            doc.setFontSize(7);
            doc.setTextColor(120, 140, 130);
            doc.setFont("helvetica", "italic");
            doc.text(
              `UniServe Menu Management Report - Page ${i} of ${pageCount} - Confidential`,
              15,
              doc.internal.pageSize.height - 8,
            );

            // Generated timestamp on last page
            if (i === pageCount) {
              doc.setTextColor(150, 150, 150);
              doc.setFontSize(6);
              doc.text(
                `Generated on ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}`,
                195,
                doc.internal.pageSize.height - 8,
                { align: "right" }
              );
            }
          }

          const suffix = days === 1 ? "Daily" : days === 7 ? "Weekly" : "Monthly";
          doc.save(`UniServe_Menu_Report_${suffix}.pdf`);
          setShowSuccessModal(true);
          setIsGenerating(false);
        };
      } catch (error) {
        console.error(error);
        toast.error("Menu report generation failed");
        setIsGenerating(false);
      }
    }, 700);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loder />
      </div>
    );
  }

  const report = summarizeReport(getFilteredOrders(parseInt(range, 10)));

  return (
    <div className="min-h-screen w-full p-6 md:p-8 bg-[#F8FAFC]">
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full border border-slate-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Ready</h2>
            <p className="text-slate-500 mb-6 text-sm">
              Your {range}-day menu management report has been exported.
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

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Daily Menu Summary Report</h1>
            <p className="text-slate-500 text-sm max-w-2xl">
              This will generate a daily summary report of all menu items, helping admins plan the next day’s food preparation while reducing waste.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => navigate(`?range=${option.value}`)}
                  className={`rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
                    range === option.value
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              disabled={isGenerating}
              onClick={() => generatePDFReport(parseInt(range, 10))}
              className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl font-bold text-slate-700 shadow-sm hover:border-emerald-500 transition-all disabled:opacity-60"
            >
              {isGenerating ? (
                <FaSpinner className="animate-spin text-emerald-500" />
              ) : (
                <FaFilePdf className="text-rose-500" />
              )}
              <span className="text-xs uppercase tracking-wider">Generate PDF</span>
              <IoChevronDown className="text-slate-400" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">Total items sold per day</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{report.totalItemsSold}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">Most popular food item</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{report.mostPopular[0]}</p>
            <p className="text-xs text-slate-500 mt-1">Qty: {report.mostPopular[1]}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">Remaining stock</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{report.remainingStock}</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Menu-wise Summary</h2>
              <p className="text-xs text-slate-500">Sold quantity and remaining stock for each menu item</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wide">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Sold</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.menuStats.map((item) => (
                  <tr key={item.name} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 text-slate-700">{item.category}</td>
                    <td className="py-3 px-4 text-slate-700">Rs.{item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-700">{item.soldQty}</td>
                    <td className="py-3 px-4 text-slate-700">{item.remainingStock}</td>
                    <td className="py-3 px-4 text-slate-700">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2 mb-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">Total revenue per day</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{formatLKR(report.totalRevenue)}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">Sold out items</p>
            {report.soldOutItems.length > 0 ? (
              <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-600">
                {report.soldOutItems.slice(0, 5).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-slate-600">No sold out items in this range.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">Report benefits</p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-600">
            <li>Analyze daily performance</li>
            <li>Plan next day food preparation</li>
            <li>Reduce food waste</li>
            <li>Improve profit management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
