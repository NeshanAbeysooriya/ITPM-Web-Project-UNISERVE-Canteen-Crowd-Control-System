import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <div className="app-shell min-h-screen flex flex-col">
      <Header />
      {/* Header is fixed, so we reserve space here to avoid overlap */}
      <div className="flex-1 pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

