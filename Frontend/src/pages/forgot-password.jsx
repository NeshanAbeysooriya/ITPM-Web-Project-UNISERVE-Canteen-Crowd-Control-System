import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdVpnKey, MdLockOutline, MdArrowBack, MdShield } from "react-icons/md";

export default function ForgetPassword() {
  //meke piyawara dekak thiyenava 1. email ek type karana ek 2. OTP ek type karana ek
  const [step, setStep] = useState("email"); //me email enter karan ekt adala ek
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  async function sendOTP() {
    //OTP ek send karana function ek
    try {
      await axios.get(
        import.meta.env.VITE_API_URL + "/api/users/send-otp/" + email
      );
      toast.success("OTP sent to your email " + email);
      setStep("otp");
    } catch (e) {
      console.log(e);
      toast.error("Failed to send OTP. Please try again.");
    }
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await axios.put(
        import.meta.env.VITE_API_URL + "/api/users/change-password",
        {
          email: email,
          otp: otp,
          newPassword: newPassword,
        }
      );
      toast.success(
        "Password changed successfully. Please login with your new password."
      );
      navigate("/login");
    } catch (e) {
      console.error(e);
      toast.error("OTP is incorrect or expired. Please try again.");
      return;
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url('/background.jpg')] bg-cover bg-center relative overflow-hidden font-sans">
      {/* Dark Overlay for Depth */}
      <div className="absolute inset-0 bg-secondary/60 backdrop-blur-[3px]"></div>

      {/* Main Glass Container */}
      <div className="relative z-10 w-full max-w-[460px] px-6">
        <div className="bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] p-10 animate-in fade-in zoom-in duration-500">
          
          {/* Back Navigation */}
          <button 
            onClick={() => step === "otp" ? setStep("email") : navigate("/login")}
            className="flex items-center gap-2 text-secondary/40 hover:text-accent transition-colors mb-8 group"
          >
            <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Login</span>
          </button>

          {step === "email" && (
            <div className="flex flex-col gap-8 animate-in slide-in-from-left-4 duration-300">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-accent shadow-inner mb-6 rotate-3">
                  <MdEmail size={32} />
                </div>
                <h1 className="text-4xl font-black text-secondary  tracking-tighter leading-tight">
                  Recover <br /> <span className="text-accent underline decoration-highlight">Account.</span>
                </h1>
                <p className="text-secondary/50 font-medium text-sm leading-relaxed">
                  Lost your access? Enter your email and we'll send a secure OTP to verify your identity.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/20 group-focus-within:text-accent transition-colors">
                    <MdEmail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    className="w-full py-5 pl-12 pr-6 rounded-2xl bg-primary/50 border-none text-secondary placeholder:text-secondary/30 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold"
                  />
                  {/**email ek type karanna thiyena part ek */}
                </div>

                <button
                  className="w-full py-5 rounded-2xl bg-accent text-white font-black uppercase tracking-widest hover:shadow-[0_20px_40px_rgba(var(--color-accent),0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl"
                  onClick={sendOTP}
                >
                  Send OTP Code
                </button>
              </div>
            </div>
          )}

          {step === "otp" && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
              <div className="space-y-2">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 -rotate-3">
                  <MdVpnKey size={32} />
                </div>
                <h1 className="text-4xl font-black text-secondary  tracking-tighter">
                  Reset <br /> <span className="text-highlight">Security.</span>
                </h1>
                <p className="text-secondary/50 font-medium text-sm ">
                  Verification sent to <span className="text-secondary font-bold underline">{email}</span>
                </p>
              </div>

              <div className="space-y-3 mt-4">
                <div className="relative">
                  <MdShield className="absolute left-4 top-1/2 -translate-y-1/2 text-highlight" size={20} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="0 0 0 0 0 0"
                    className="w-full py-4 pl-12 rounded-2xl bg-primary border-none text-secondary text-center font-black tracking-[0.5em] outline-none focus:ring-2 focus:ring-highlight/30 transition-all"
                  />
                </div>

                <div className="relative">
                  <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/20" size={20} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Secret Password"
                    className="w-full py-4 pl-12 rounded-2xl bg-primary border-none text-secondary font-bold outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>

                <div className="relative">
                  <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/20" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Secret Password"
                    className="w-full py-4 pl-12 rounded-2xl bg-primary border-none text-secondary font-bold outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>

                <button
                  className="w-full py-5 mt-4 rounded-2xl bg-secondary text-white font-black uppercase tracking-widest hover:shadow-2xl hover:bg-secondary/90 transition-all active:scale-95 shadow-xl shadow-secondary/20"
                  onClick={changePassword}
                >
                  Verify & Update
                </button>
              </div>

              <button 
                onClick={() => setStep("email")}
                className="text-[10px] text-center text-accent font-black uppercase tracking-widest hover:underline mt-2"
              >
                Resend code?
              </button>
            </div>
          )}

          {/* Footer Branding */}
          <div className="mt-12 pt-6 border-t border-secondary/5 flex justify-center">
            <p className="text-[9px] text-secondary/20 font-black uppercase tracking-[0.3em]">
              Encrypted Session &bull; University Canteen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}