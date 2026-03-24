import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import UserHomePage from "./userHomePage";
import AboutUsPage from "./aboutUs";
import MenuManagement from "./menuManagement";
import CartPage from "./cart";
import CheckoutPage from "./checkout";
import UserOrdersPage from "./userOrderPage";
import OrderTrackingPage from "./OrderTrackingPage";

export default function HomePage() {
  return (
    <div className="w-full h-full bg-primary">
      <Header />
      <Routes path="/">
        <Route path="/" element={<UserHomePage/>} />
        <Route path="/menu" element={<MenuManagement/>} />
        <Route path="/feedback" element={<h1>Feedback</h1>} />
        <Route path="/about" element={<AboutUsPage/>} />
        <Route path="/*" element={<h1>404 Not Found</h1>} />
         <Route path="/cart" element={<CartPage/>} />
         <Route path="/checkout" element={<CheckoutPage/>} />
         <Route path="/orders" element={<UserOrdersPage/>} />
        <Route path="/track" element={<OrderTrackingPage />} />

      </Routes>
    </div>
  );
}
