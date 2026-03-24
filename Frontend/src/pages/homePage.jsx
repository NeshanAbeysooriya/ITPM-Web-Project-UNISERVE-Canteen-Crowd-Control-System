import { Route, Routes } from "react-router-dom";
import Header from "../components/header"
import MenuPage from "./menuPage";
import UserHomePage from "./userHomePage";
import AboutUsPage from "./aboutUs";
import FeedbackPage from "./feedback";
import MenuOverview from "./menuOverview";
import ContactUsPage from "./contactUs";

export default function HomePage() {
  return (
    <div className="w-full h-full bg-primary">
      <Header />
      <Routes path="/">
        <Route path="/" element={<UserHomePage/>} />
        <Route path="/Menu" element={<MenuPage/>} />
        <Route path="/feedback" element={<FeedbackPage/>} />
        <Route path="/contact" element={<ContactUsPage/>} />
        <Route path="/about" element={<AboutUsPage/>} />
        <Route path="/menu/:id" element={<MenuOverview/>} />
        <Route path="/*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </div>
  );
}
