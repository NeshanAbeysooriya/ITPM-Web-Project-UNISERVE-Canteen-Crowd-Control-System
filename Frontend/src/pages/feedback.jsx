import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MdStar,
  MdFastfood,
  MdEmail,
  MdPerson,
  MdPhone,
  MdCheckCircle,
  MdErrorOutline,
  MdSend,
  MdVerified,
  MdRestaurantMenu,
} from "react-icons/md";
import Footer from "../components/footer";
import toast from "react-hot-toast";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    menuName: "",
    comment: "",
    rating: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [allFeedbacks, setAllFeedbacks] = useState([]);

  // --- NEW STATE FOR AUTO-SCROLL ---
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleCount = 3; // Number of feedbacks visible at once

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/feedback",
        );
        setAllFeedbacks(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load feedback");
      }
    };
    fetchFeedbacks();
  }, []);

  // --- AUTO-SCROLL LOGIC ---
  useEffect(() => {
    if (allFeedbacks.length <= visibleCount) return;

    const interval = setInterval(() => {
      setScrollIndex(
        (prev) => (prev + 1) % (allFeedbacks.length - visibleCount + 1),
      );
    }, 4000); // Cycles every 4 seconds

    return () => clearInterval(interval);
  }, [allFeedbacks]);

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "We'd love to know your name!";
    if (!formData.email.match(/\S+@\S+\.\S+/))
      newErrors.email = "Please enter a valid email.";
    if (!formData.menuName.trim())
      newErrors.menuName = "Which dish did you try?";
    if (formData.rating === 0)
      newErrors.rating = "Please select a star rating.";
    if (formData.comment.length < 10)
      newErrors.comment = "Tell us a bit more (min 10 chars).";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const payload = {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          menuName: formData.menuName,
          rating: formData.rating,
          comment: formData.comment,
        };

        const token = localStorage.getItem("token");

        const response = await axios.post(
          import.meta.env.VITE_API_URL + "/api/feedback",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 200 || response.status === 201) {
          setSubmitted(true);
          // Refresh list to include new feedback
          const res = await axios.get(
            import.meta.env.VITE_API_URL + "/api/feedback",
          );
          setAllFeedbacks(res.data);
        }
      } catch (err) {
        console.log(err);
        toast.error(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary text-secondary selection:bg-accent/20">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="relative">
            <div className="mb-10">
              <h1 className="text-5xl font-black tracking-tight mb-4 ">
                Feedback <span className="text-highlight">&</span> Contact
              </h1>
              <p className="text-secondary/60 text-lg">
                Your voice helps us make UniServe better for every student.
              </p>
            </div>

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-bordercolor p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-secondary/5 relative overflow-hidden"
              >
                {isSubmitting && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="relative">
                        <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          className={`w-full pl-12 pr-4 py-4 bg-primary border ${errors.name ? "border-red-400" : "border-bordercolor"} rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all`}
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs font-bold flex items-center gap-1 ml-2">
                          <MdErrorOutline /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="relative">
                        <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" />
                        <input
                          type="email"
                          placeholder="Enter Email"
                          className={`w-full pl-12 pr-4 py-4 bg-primary border ${errors.email ? "border-red-400" : "border-bordercolor"} rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all`}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs font-bold flex items-center gap-1 ml-2">
                          <MdErrorOutline /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <MdRestaurantMenu className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" />
                      <input
                        type="text"
                        placeholder="Menu Item Name (e.g. Spicy Ramen)"
                        className={`w-full pl-12 pr-4 py-4 bg-primary border ${errors.menuName ? "border-red-400" : "border-bordercolor"} rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all`}
                        value={formData.menuName}
                        onChange={(e) =>
                          setFormData({ ...formData, menuName: e.target.value })
                        }
                      />
                    </div>
                    {errors.menuName && (
                      <p className="text-red-500 text-xs font-bold flex items-center gap-1 ml-2">
                        <MdErrorOutline /> {errors.menuName}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" />
                    <input
                      type="text"
                      placeholder="Phone Number (Optional)"
                      className="w-full pl-12 pr-4 py-4 bg-primary border border-bordercolor rounded-2xl focus:outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="pt-4 border-t border-bordercolor">
                    <label className="block text-sm font-black uppercase tracking-widest text-secondary/40 mb-4 text-center">
                      Rate your experience
                    </label>
                    <div className="flex justify-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MdStar
                          key={star}
                          size={44}
                          className={`cursor-pointer transition-all ${star <= formData.rating ? "text-highlight scale-110" : "text-gray-200 hover:text-highlight/40"}`}
                          onClick={() =>
                            setFormData({ ...formData, rating: star })
                          }
                        />
                      ))}
                    </div>
                    {errors.rating && (
                      <p className="text-red-500 text-xs font-bold text-center mb-4">
                        {errors.rating}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <MdFastfood className="absolute left-4 top-4 text-secondary/30" />
                    <textarea
                      placeholder="Your thoughts on the food..."
                      rows="4"
                      className={`w-full pl-12 pr-4 py-4 bg-primary border ${errors.comment ? "border-red-400" : "border-bordercolor"} rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all`}
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                    ></textarea>
                    {errors.comment && (
                      <p className="text-red-500 text-xs font-bold mt-1 ml-2 flex items-center gap-1">
                        <MdErrorOutline /> {errors.comment}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-secondary text-white font-black rounded-[2rem] hover:bg-accent hover:shadow-xl hover:shadow-accent/20 transition-all duration-500 flex items-center justify-center gap-3 group"
                  >
                    Send My Feedback{" "}
                    <MdSend className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white border border-accent p-12 rounded-[3rem] text-center shadow-2xl">
                <MdCheckCircle className="text-accent text-8xl mx-auto mb-6 animate-bounce" />
                <h2 className="text-3xl font-black mb-2 text-secondary">
                  Feedback Received!
                </h2>
                <p className="text-secondary/60 mb-8">
                  Thanks {formData.name}, your review is live on the community
                  feed.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      menuName: "",
                      comment: "",
                      rating: 0,
                    });
                  }}
                  className="px-8 py-3 border-2 border-secondary rounded-full font-bold hover:bg-secondary hover:text-white transition-all"
                >
                  Write Another
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: LIVE FEED PREVIEW (MODERN SCROLL SOLUTION) */}
          <div className="hidden lg:block space-y-8">
            <h3 className="text-2xl font-bold border-b-4 border-accent inline-block mb-4">
              Community Buzz
            </h3>

            {/* Container for Scrolling Cards */}
            <div className="relative h-[550px] overflow-hidden">
              <div
                className="space-y-6 transition-all duration-1000 ease-in-out"
                style={{ transform: `translateY(-${scrollIndex * 180}px)` }}
              >
                {allFeedbacks.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/40 backdrop-blur-md border border-white p-6 rounded-[2.5rem] shadow-sm transform hover:-translate-x-2 transition-all h-[160px]"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-highlight rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                          {item.fullName?.charAt(0)}
                        </div>
                        <span className="font-bold text-sm">
                          {item.fullName}{" "}
                          <MdVerified className="inline text-blue-500" />
                        </span>
                      </div>
                      <div className="flex text-highlight text-xs">
                        {[...Array(item.rating)].map((_, i) => (
                          <MdStar key={i} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-secondary/70 italic line-clamp-3">
                      "{item.comment}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Fade Gradient for Modern Look */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent pointer-events-none"></div>
            </div>

            {/* Support Info Card */}
            <div className="bg-secondary text-white p-8 rounded-[3rem] mt-12">
              <h4 className="text-xl font-bold mb-4">Direct Support</h4>
              <p className="text-white/50 text-sm mb-6">
                Need immediate help with an order? Contact our campus kitchen
                manager directly.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <MdPhone className="text-accent" />
                  </div>
                  <span className="font-medium">011 452 3698</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <MdEmail className="text-accent" />
                  </div>
                  <span className="font-medium">support@uniserve.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
