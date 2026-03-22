import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/homePage";
import TestPage from "./pages/test";



function App() {
  return (
    <BrowserRouter>
        <div className="w-full h-[100vh]">
          <Toaster position="top-right" />

          <Routes path="/">
            {" "}
            {/*install karagatta router-dom ekem ganne meka component ekak */}
            {/*  me vage Route gdk dagann puluvam */}
            <Route path="/*" element={<HomePage />} />

            <Route path="/test" element={<TestPage />} />

          </Routes>
        </div>

    </BrowserRouter>
  );
}

export default App;
