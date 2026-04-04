import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  IoClose,
  IoStar,
  IoCreateOutline,
  IoSaveOutline,
  IoChatbubbleEllipsesOutline,
  IoCalendarOutline,
  IoFastFoodOutline,
  IoSparklesOutline
} from "react-icons/io5";
import { Loder } from "../components/loder";

/**
 * EDIT FEEDBACK MODAL - MINIMALIST GLASS
 */
function FeedbackEditModal({ feedback, close, refresh }) {
  const [rating, setRating] = useState(feedback.rating);
  const [comment, setComment] = useState(feedback.comment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/feedback/${feedback._id}`,
        { ...feedback, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review updated!");
      refresh();
      close();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-200/40 backdrop-blur-xl z-[100] flex justify-center items-center px-4 animate-in fade-in duration-500">
      <div className="bg-white/90 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] w-full max-w-md overflow-hidden border border-white">
        <div className="p-8 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary tracking-tight">Edit Feedback</h2>
          <button onClick={close} className="p-2 bg-primary rounded-full hover:bg-slate-100 transition-colors">
            <IoClose size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-8 pt-2 space-y-6">
          <div className="flex justify-center bg-primary/50 py-4 rounded-[2rem] border border-bordercolor/50">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl px-1 transition-all hover:scale-125 ${
                  star <= rating ? "text-highlight" : "text-slate-200"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            className="w-full p-5 rounded-[2rem] border-none bg-primary/60 focus:bg-white focus:ring-4 focus:ring-accent/10 outline-none min-h-[140px] text-secondary transition-all"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button 
            disabled={isSubmitting}
            className="w-full bg-accent text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-accent/20 hover:shadow-accent/40 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? "Syncing..." : <><IoSaveOutline size={20}/> Update Review</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MyFeedbackPage() {
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login Required");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userEmail = decoded.email;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredOrders = res.data.filter(order => order.email === userEmail);
      setOrders(filteredOrders);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFEFF]">
      {isEditModalOpen && (
        <FeedbackEditModal
          feedback={selectedFeedback}
          close={() => setIsEditModalOpen(false)}
          refresh={fetchMyFeedback}
        />
      )}

      {/* Modern Soft Header */}
      <header className="pt-10 pb-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent font-bold text-sm bg-accent/10 w-fit px-4 py-1 rounded-full">
              <IoSparklesOutline /> Personal Insights
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter">
              My Taste <span className="text-accent underline decoration-accent/20 underline-offset-8">Records</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white border border-bordercolor p-2 pr-6 rounded-full shadow-sm">
             <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-accent">
                <IoChatbubbleEllipsesOutline size={24} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Activity</p>
                <p className="text-lg font-black text-secondary">{myFeedbacks.length} Reviews</p>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loder /></div>
        ) : myFeedbacks.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-bordercolor/60 shadow-sm max-w-xl mx-auto mt-10">
             <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <IoFastFoodOutline className="text-slate-200" size={40} />
             </div>
             <h2 className="text-2xl font-bold text-secondary mb-2">No feedback yet</h2>
             <p className="text-slate-400 mb-8">Ready to share your culinary journey? Your reviews will appear here.</p>
             <button onClick={() => navigate("/menu")} className="bg-accent text-white px-10 py-4 rounded-full font-bold hover:shadow-xl hover:shadow-accent/30 transition-all">
                Start Exploring
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myFeedbacks.map((fb) => (
              <div
                key={fb._id}
                className="group bg-white rounded-[2rem] p-8 border border-bordercolor/40 hover:border-accent/30 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(34,197,94,0.08)] transition-all duration-500 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-primary group-hover:bg-accent/10 rounded-2xl transition-colors">
                    <IoFastFoodOutline className="text-secondary group-hover:text-accent transition-colors" size={24} />
                  </div>
                  <div className="flex gap-0.5 pt-1">
                    {[...Array(5)].map((_, i) => (
                      <IoStar key={i} className={i < fb.rating ? "text-highlight" : "text-slate-100"} size={16} />
                    ))}
                  </div>
                </div>

                <h3 className="font-bold text-xl mb-2 text-secondary tracking-tight group-hover:text-accent transition-colors">{fb.menuName}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-10 italic">
                  "{fb.comment}"
                </p>

                <div className="mt-auto pt-6 border-t border-primary/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <IoCalendarOutline size={14} />
                    <span className="text-[10px] font-bold tracking-widest uppercase">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => { setSelectedFeedback(fb); setIsEditModalOpen(true); }}
                    className="p-3 bg-primary hover:bg-accent hover:text-white rounded-xl transition-all"
                  >
                    <IoCreateOutline size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}