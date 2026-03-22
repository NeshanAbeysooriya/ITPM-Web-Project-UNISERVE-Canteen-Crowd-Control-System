import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdDashboard, MdLogout, MdErrorOutline } from "react-icons/md";

export default function UserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(import.meta.env.VITE_API_URL + "/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-full relative z-[200]">
      {loading && (
        <div className="w-6 h-6 border-2 border-accent border-b-transparent rounded-full animate-spin"></div>
      )}

      {user && (
        <div className="relative">
          {/* User Pill */}
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-bordercolor hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group"
          >
            <div className="relative">
              <img
                src={user.image}
                className="w-9 h-9 rounded-full border-2 border-accent object-cover"
                alt="Profile"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent border-2 border-white rounded-full"></div>
            </div>

            <span className="font-bold text-sm text-secondary hidden sm:block">
              {user.firstName}
            </span>

            <IoMdArrowDropdown className={`text-xl text-secondary/40 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Updated Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-[120%] right-0 flex flex-col bg-white border border-bordercolor text-secondary shadow-2xl rounded-2xl w-48 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b border-bordercolor bg-primary/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Account</p>
                <p className="text-xs font-bold truncate">{user.email || 'Student'}</p>
              </div>
              
              <a
                className="flex items-center gap-3 px-4 py-4 hover:bg-accent/10 hover:text-accent transition-colors text-sm font-bold"
                href="/dashboard"
              >
                <MdDashboard className="text-lg" /> Dashboard
              </a>
              
              <div className="p-2 border-t border-bordercolor">
                <button
                  className="w-full flex items-center gap-3 px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutConfirmOpen(true);
                  }}
                >
                  <MdLogout className="text-lg" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && user == null && (
        <a
          href="/login"
          className="bg-accent text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-accent/20 hover:scale-105 transition-all"
        >
          Login
        </a>
      )}

      {/* Modern Modal Overlay */}
      {isLogoutConfirmOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[999999] bg-secondary/40 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300 px-4">
          <div className="w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-2xl p-8 border border-bordercolor transform animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <MdErrorOutline className="text-red-500 text-3xl" />
            </div>
            
            <h2 className="text-2xl font-black text-secondary text-center mb-2 leading-tight">
              Leaving so soon?
            </h2>
            <p className="text-secondary/50 text-center mb-8 text-sm">
              You'll need to login again to pre-order your favorite meals.
            </p>

            <div className="flex flex-col gap-3">
              <button
                className="w-full bg-secondary text-white py-4 rounded-2xl font-black hover:bg-red-500 transition-all shadow-xl shadow-secondary/10 active:scale-95"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Yes, Log me out
              </button>
              <button
                className="w-full bg-primary text-secondary py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                onClick={() => setIsLogoutConfirmOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}