import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/homePage";
import TestPage from "./pages/test";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminPage from "./pages/adminPage";
import ForgetPassword from "./pages/forgot-password";
import UserDashboard from "./pages/userDashboard";
import TimeSlotAdminPanel from "./pages/admin/timeSlotAdminPanel";

function App() {
  return (
    <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="w-full h-[100vh]">
        <Toaster position="top-right" />

        <Routes path="/">
          {" "}
          {/*install karagatta router-dom ekem ganne meka component ekak */}
          {/*  me vage Route gdk dagann puluvam */}
          <Route path="/*" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/forget-password"
            element={<ForgetPassword/>}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/*" element={<UserDashboard/>} />
          <Route path="/admin/*" element={<AdminPage/>} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/panel" element={<TimeSlotAdminPanel />} />
        </Routes>
      </div>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
