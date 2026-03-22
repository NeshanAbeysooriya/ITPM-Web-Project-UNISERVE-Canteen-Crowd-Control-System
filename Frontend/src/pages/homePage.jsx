import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import UserHomePage from "./userHomePage";
import AboutUsPage from "./aboutUs";

export default function HomePage() {
  return (
    <div className="w-full h-full bg-primary">
      <Header />
      <Routes path="/">
        <Route path="/" element={<UserHomePage/>} />
        <Route path="/feedback" element={<h1>Feedback</h1>} />
        <Route path="/about" element={<AboutUsPage/>} />
        <Route path="/*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </div>
  );
}
