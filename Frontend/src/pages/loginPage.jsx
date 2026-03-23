import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    //google login hook ek
    onSuccess: (response) => {
      console.log(response);
      axios
        .post(import.meta.env.VITE_API_URL + "/api/users/google-login", {
          token: response.access_token,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          const user = res.data.user;
          if (user.role == "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("Google login failed:", err);
          toast.error("Google login failed. Please try again.");
        });
    }, //google login ek succes unat passe apu token ek print karann
  });

  async function login() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/users/login",
        { email, password },
      );

      // Save token
      localStorage.setItem("token", response.data.token);

      toast.success("Login Successful");

      const user = response.data.user;
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (e) {
      console.error("Login failed:", e);
      toast.error("Login failed. Please check your credentials");
    }
  }

  return (
    /* Changed background image logic to a food/canteen theme */
    <div className="w-full h-screen flex bg-[url('/background.jpg')] bg-cover bg-center">
      
      {/* Left Section - Rebranded for Canteen System */}
      <div className="hidden lg:flex w-1/2 h-full text-white flex-col justify-center items-start px-16 bg-black/40 backdrop-blur-[2px]">
        <img
          src="/logo.png" 
          alt="Logo"
          className="w-32 h-32 mb-8 object-contain"
        />
        <h1 className="text-5xl font-bold leading-tight">
          <span className="text-primary">Skip the Queue.</span>{" "}
          <span className="text-primary">Savor the Meal.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-200 max-w-lg">
          Welcome to the UniServe Canteen Portal – pre-order your favorite meals, 
          check live crowd status, and enjoy a hassle-free dining experience.
          <br />
          <span className="italic">Fresh, fast, and organized.</span>
        </p>
        <p className="mt-20 text-sm text-gray-300">
          © 2026 UniServe – Canteen Crowd Control System.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <div className="backdrop-blur-lg bg-black/25 border border-white/40 shadow-2xl rounded-2xl p-8 flex flex-col gap-3 text-white transition-all hover:scale-[1.01] duration-300 w-[400px]">
          
          {/* Logo */}
          {/* <div className="flex justify-center mb-2">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
          </div> */}

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-primary">
            <span className="text-accent">Hungry ?  Login Now</span>
          </h2>
          <p className="text-sm text-white/80 text-center -mt-2">
            Sign in to access the menu and pre-order
          </p>

          {/* Email Input */}
          <div className="mt-4">
            <label className="text-sm font-medium text-white">Email</label>
            <input
              type="email"
              placeholder="john@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 mt-1 rounded-xl bg-white/20 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-medium text-white">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 mt-1 rounded-xl bg-white/20 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end items-center text-xs">
            <Link to="/forget-password" ocean-accent className="text-accent hover:underline font-bold">
              Froget Password ?
            </Link>
          </div>

          {/* Login Button */}
          <button
            onClick={login}
            className="w-full h-11 mt-2 rounded-xl bg-accent hover:bg-accent/80 text-white font-bold transition-all duration-300 shadow-lg transform active:scale-95"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="flex items-center my-2">
            <div className="flex-grow h-px bg-white/20"></div>
            <span className="px-3 text-[10px] uppercase tracking-widest text-white/50">Continue with</span>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={googleLogin}
            className="w-full h-11 rounded-xl flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            <img
              src="/google.png"
              alt="Google"
              className="w-8 h-8 object-contain"
            />
            Sign in with Google
          </button>

          {/* Extra Links */}
          <p className="text-sm text-white/80 text-center mt-4">
            New to the canteen?{" "}
            <Link to="/register" className="text-accent font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}