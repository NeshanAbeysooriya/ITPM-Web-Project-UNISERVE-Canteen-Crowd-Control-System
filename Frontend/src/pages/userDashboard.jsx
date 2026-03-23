import React from "react";
import {
  MdDashboard,
  MdPerson,
  MdHistory,
  MdMessage,
  MdLogout,
  MdChevronRight,
  MdReceiptLong,
} from "react-icons/md";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import UserSettings from "./settings";
import UserOverview from "./userOverview";
import UserFeedback from "./userFeedback";

// Import your sub-pages (or define them as smaller components below)

export default function UserDashboard() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <MdDashboard />,
      path: "/dashboard",
    },
    {
      id: "orders",
      label: "Order History",
      icon: <MdReceiptLong />,
      path: "/dashboard/orders",
    },
    {
      id: "feedback",
      label: "My Feedback",
      icon: <MdMessage />,
      path: "/dashboard/feedback",
    },
    {
      id: "profile",
      label: "Account Settings",
      icon: <MdPerson />,
      path: "/dashboard/settings",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFE]">
      <Header />

      {/* Container with top padding to clear fixed header */}
      <div className="pt-24 flex flex-1">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-72 xl:w-80 flex-shrink-0 flex-col bg-white border-r border-bordercolor shadow-sm sticky top-24 h-[calc(100vh-5rem)]">
          <div className="p-8">
            <h2 className="text-2xl font-black text-secondary italic">
              My <span className="text-accent">Portal</span>
            </h2>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-accent/10 text-accent shadow-sm"
                      : "text-secondary/40 hover:bg-primary hover:text-secondary"
                  }`}
                >
                  <span
                    className={`text-xl ${isActive ? "text-accent" : "group-hover:text-secondary"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && <MdChevronRight className="ml-auto" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto min-h-[500px]">
            <Routes>
              <Route path="/" element={<UserOverview/>} />
              <Route path="/orders" element={<h1>order</h1>} />
              <Route path="/feedback" element={<UserFeedback/>} />
              <Route path="/settings" element={<UserSettings />} />
            </Routes>
          </div>
        </main>
      </div>

      <Footer className="mt-auto" />
    </div>
  );
}
