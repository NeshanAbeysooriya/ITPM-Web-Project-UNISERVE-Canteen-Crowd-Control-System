import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    // simple email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  async function register() {
    if (!validateForm()) return;

    try {
      await axios.post(import.meta.env.VITE_API_URL + "/api/users/", {
        email,
        firstName,
        lastName,
        password,
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (e) {
      console.error("Registration failed:", e);
      toast.error(
        e.response?.data?.message || "Registration failed. Please try again."
      );
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row lg:gap-12 px-5 py-10 lg:py-0">

        {/* Left - Branding / Welcome */}
        <div className="hidden lg:flex lg:w-5/12 flex-col justify-center items-start text-left px-6 xl:px-10 text-white">
          <div className="mb-5 mt-5">
            <img
              src="/logo.png"
              alt="Canteen Logo"
              className="w-30 h-30 lg:w-35 lg:h-35 object-contain drop-shadow-lg"
            />
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
            Order Smart.
            <br />
            <span className="text-green-400">Eat Happy.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-200 max-w-md leading-relaxed">
            Fast canteen ordering, 
            Skip the long queues
            <br />
            <span className="italic opacity-90">Quick • Fresh • Fair</span>
          </p>

          

          <p className="mt-auto pt-20 text-sm text-gray-400">
            © 2026 University Canteen System
          </p>
        </div>

        {/* Right - Form */}
        <div className="w-full lg:w-7/12 xl:w-6/12 mx-auto">
          <div className="
            bg-white/95 backdrop-blur-md 
            border border-gray-200/70 
            shadow-2xl shadow-black/20 
            rounded-2xl lg:rounded-3xl 
            p-6 sm:p-8 lg:p-10
          ">

            {/* Mobile header */}
            <div className="flex flex-col items-center lg:hidden mb-8">
              <img
                src="/logo.png"
                alt="Canteen Logo"
                className="w-16 h-16 object-contain mb-4 drop-shadow-md"
              />
              <h2 className="text-2xl font-bold text-gray-800">
                Join & Order Faster
              </h2>
              <p className="mt-2 text-gray-600 text-sm text-center">
                Create your account to skip queues and order in advance
              </p>
            </div>

            {/* Desktop title */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                Create Account
              </h2>
              <p className="mt-2 text-gray-600">
                Get started with smart canteen ordering
              </p>
            </div>

            <div className="space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Kasun"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="
                      w-full px-4 py-3 rounded-xl border border-gray-300 
                      focus:border-green-500 focus:ring-2 focus:ring-green-200/50
                      outline-none transition-all duration-200
                    "
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Perera"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="
                      w-full px-4 py-3 rounded-xl border border-gray-300 
                      focus:border-green-500 focus:ring-2 focus:ring-green-200/50
                      outline-none transition-all duration-200
                    "
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="student@campus.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full px-4 py-3 rounded-xl border border-gray-300 
                    focus:border-green-500 focus:ring-2 focus:ring-green-200/50
                    outline-none transition-all duration-200
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full px-4 py-3 rounded-xl border border-gray-300 
                    focus:border-green-500 focus:ring-2 focus:ring-green-200/50
                    outline-none transition-all duration-200
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="
                    w-full px-4 py-3 rounded-xl border border-gray-300 
                    focus:border-green-500 focus:ring-2 focus:ring-green-200/50
                    outline-none transition-all duration-200
                  "
                />
              </div>

              <button
                onClick={register}
                className="
                  w-full py-3.5 mt-3 
                  bg-gradient-to-r from-green-600 to-emerald-600 
                  hover:from-green-700 hover:to-emerald-700
                  text-white font-medium rounded-xl shadow-lg shadow-green-600/25
                  hover:shadow-green-700/35 active:scale-[0.98]
                  transition-all duration-300
                "
              >
                Create Account
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-green-600 font-medium hover:text-green-700 hover:underline"
                >
                  Sign in
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}