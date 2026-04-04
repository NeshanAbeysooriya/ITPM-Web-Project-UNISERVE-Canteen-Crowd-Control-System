import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import Footer from "../components/footer";
import { Loder } from "../components/loder";
import { jwtDecode } from "jwt-decode";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setOrders([]);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const res = await axios.get(
        import.meta.env.VITE_API_URL + "/api/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userOrders = res.data.filter(order => order.email === decoded.email);
      setOrders(userOrders);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("ready") || s.includes("collected") || s.includes("completed")) return "bg-green-100 text-green-800 border-green-200";
    if (s.includes("preparing") || s.includes("processing")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (s.includes("pending") || s.includes("placed")) return "bg-amber-100 text-amber-800 border-amber-200";
    if (s.includes("cancel")) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // ================= ENHANCED RECEIPT WITH LOGO & FOOTER DETAILS =================
  const downloadInvoice = (order) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const greenBrand = [34, 197, 94]; 
    const textDark = [31, 41, 55];    
    const textLight = [107, 114, 128]; 

    // Helper to add Logo
    const img = new Image();
    img.src = "/logo.png"; // Ensure this matches your public folder path

    img.onload = () => {
      // 1. HEADER SECTION (Green Background)
      doc.setFillColor(...greenBrand);
      doc.rect(0, 0, 600, 120, 'F');
      
      // Logo & Brand Name
      doc.addImage(img, 'PNG', 40, 30, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text("UniServe", 90, 60);
      
      // Website Details from Footer (Right Aligned in Header)
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("support@uniserve.com", 555, 45, { align: "right" });
      doc.text("011 452 3698", 555, 60, { align: "right" });
      doc.text("Mon–Fri: 7:30 AM – 8:00 PM", 555, 75, { align: "right" });
      doc.text("www.uniserve.com", 555, 90, { align: "right" });

      doc.setFontSize(10);
      doc.text("University Canteen Management System", 90, 75);

      // 2. RECEIPT TITLE
      doc.setTextColor(...textDark);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("RECEIPT", 40, 160);
      doc.setDrawColor(229, 231, 235);
      doc.line(40, 175, 555, 175);

      // Order Info Grid
      doc.setFontSize(9);
      doc.setTextColor(...textLight);
      doc.text("ORDER NUMBER", 40, 195);
      doc.text("DATE & TIME", 180, 195);
      doc.text("PICKUP SLOT", 350, 195);

      doc.setFontSize(11);
      doc.setTextColor(...textDark);
      doc.setFont("helvetica", "bold");
      doc.text(`#${order.orderID}`, 40, 215);
      doc.text(new Date(order.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }), 180, 215);
      
      const pickupDisplay = order.pickupTime?.startTime 
        ? `${new Date(order.pickupTime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(order.pickupTime.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : "As Scheduled";
      doc.setTextColor(...greenBrand);
      doc.text(pickupDisplay, 350, 215);

      // 3. CUSTOMER DATA BOX
      doc.setFillColor(249, 250, 251);
      doc.rect(40, 235, 515, 65, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(...textLight);
      doc.setFont("helvetica", "normal");
      doc.text("CUSTOMER NAME", 55, 260);
      doc.text("EMAIL ADDRESS", 250, 260);
      doc.text("ORDER STATUS", 450, 260);

      doc.setFontSize(10);
      doc.setTextColor(...textDark);
      doc.setFont("helvetica", "bold");
      doc.text(order.customerName || "User", 55, 280);
      doc.text(order.email || "N/A", 250, 280);
      doc.text((order.status || "COMPLETED").toUpperCase(), 450, 280);

      // 4. ITEMS TABLE (STRICT ALIGNMENT)
      const tableData = order.items.map(item => [
        item.name,
        item.quantity.toString(),
        `LKR ${Number(item.price).toFixed(2)}`,
        `LKR ${(item.quantity * item.price).toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: 320,
        head: [['Item Description', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [243, 244, 246], textColor: textDark, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 10, font: "helvetica" },
        columnStyles: {
          0: { cellWidth: 'auto', halign: 'left' },
          1: { cellWidth: 50, halign: 'center' },
          2: { cellWidth: 100, halign: 'right' },
          3: { cellWidth: 100, halign: 'right', fontStyle: 'bold' }
        },
        didParseCell: (data) => {
          if (data.section === 'head') {
            if (data.column.index === 1) data.cell.styles.halign = 'center';
            if (data.column.index === 2 || data.column.index === 3) data.cell.styles.halign = 'right';
          }
        },
        margin: { left: 40, right: 40 }
      });

      // 5. BILLING SUMMARY
      const finalY = doc.lastAutoTable.finalY + 30;
      doc.setDrawColor(...greenBrand);
      doc.setLineWidth(2);
      doc.line(350, finalY, 555, finalY);

      doc.setFontSize(11);
      doc.setTextColor(...textLight);
      doc.setFont("helvetica", "normal");
      doc.text("Grand Total", 350, finalY + 30);

      doc.setFontSize(24);
      doc.setTextColor(...greenBrand);
      doc.setFont("helvetica", "bold");
      doc.text(`LKR ${Number(order.total).toFixed(2)}`, 555, finalY + 30, { align: 'right' });

      // 6. FOOTER
      doc.setFontSize(9);
      doc.setTextColor(...textLight);
      doc.setFont("helvetica", "italic");
      doc.text("Thank you for choosing UniServe! Skip the queue, save your time.", 300, 800, { align: 'center' });

      doc.save(`UniServe_Receipt_${order.orderID}.pdf`);
    };

    // Error handling for image loading
    img.onerror = () => {
        console.error("Logo could not be loaded. Check if logo.png exists in public folder.");
        // Fallback to generate without logo if image fails
        img.onload(); 
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 pt-30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              My Orders
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage your recent canteen orders
            </p>
          </div>

          {orders.length > 0 && (
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loder />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No orders yet</h3>
            <button onClick={() => navigate("/menu")} className="mt-6 px-8 py-4 bg-accent text-white rounded-2xl">
              Order Something Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderID} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-gray-900">Order #{order.orderID}</div>
                    <div className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</div>
                    <div className="text-sm text-amber-600 font-medium">
                        Pickup: {order.pickupTime?.startTime ? `${new Date(order.pickupTime.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(order.pickupTime.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : "Pending Slot"}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                        {(order.status || "Placed").toUpperCase()}
                    </span>
                    <span className="font-bold text-xl text-accent">LKR {Number(order.total).toFixed(2)}</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={item.image || "/placeholder.jpg"} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.quantity} x LKR {Number(item.price).toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900">LKR {(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                  <button onClick={() => downloadInvoice(order)} className="px-6 py-2 bg-green-600 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-green-700 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}