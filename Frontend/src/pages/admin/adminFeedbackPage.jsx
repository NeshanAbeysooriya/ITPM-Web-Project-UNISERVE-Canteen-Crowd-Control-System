import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoClose, IoTrashOutline, IoStar } from "react-icons/io5";
import { Loder } from "../../components/loder";

/**
 * DELETE CONFIRMATION MODAL COMPONENT
 */
function FeedbackDeleteConfirm({ feedback, close, refresh }) {
  const deleteFeedback = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/feedback/${feedback._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Feedback deleted successfully");
        refresh(); // Triggers setIsLoading(true) in parent
        close();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to delete feedback");
      });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center px-4 transition-all">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative p-8">
        <button
          onClick={close}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full flex justify-center items-center transition-colors"
        >
          <IoClose className="text-xl" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center rotate-3 bg-red-100 text-red-600">
            <IoTrashOutline className="text-3xl -rotate-3" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Delete Feedback
        </h2>
        <p className="text-center text-gray-500 mb-8 leading-relaxed">
          Are you sure you want to delete the feedback for
          <span className="font-semibold text-gray-900 block">
            "{feedback.menuName}"?
          </span>
          This action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={close}
            className="flex-1 px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={deleteFeedback}
            className="flex-1 px-6 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all order-1 sm:order-2"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * MAIN ADMIN FEEDBACK MANAGEMENT PAGE
 */
export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to access admin panel");
        navigate("/login");
        return;
      }

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setFeedbacks(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err); // 👈 IMPORTANT
          toast.error(
            err.response?.data?.message || "Error fetching feedbacks",
          );
          setIsLoading(false);
        });
    }
  }, [isLoading, navigate]);

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-[#F8FAFC]">
      {/* Modal logic */}
      {isDeleteConfirmVisible && (
        <FeedbackDeleteConfirm
          feedback={feedbackToDelete}
          close={() => setIsDeleteConfirmVisible(false)}
          refresh={() => setIsLoading(true)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Feedback Management
            </h1>
            <p className="text-slate-500 mt-1">
              Monitor user ratings and manage customer testimonials.
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-highlight rounded-full animate-pulse"></span>
            <span className="text-sm font-bold text-slate-700">
              {feedbacks.length} Reviews
            </span>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loder />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                      Menu Item
                    </th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                      Rating
                    </th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Comment
                    </th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {feedbacks.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <p className="font-bold text-slate-900">
                            {item.fullName}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-[150px]">
                            {item.email}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-600/10 whitespace-nowrap">
                            {item.menuName}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-1.5 bg-slate-50 w-fit mx-auto px-3 py-1 rounded-lg border border-slate-100">
                          <IoStar className="text-highlight" />
                          <span className="font-bold text-slate-900">
                            {item.rating}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <p
                          className="text-sm text-slate-600 max-w-xs line-clamp-2"
                          title={item.comment}
                        >
                          {item.comment}
                        </p>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => {
                            setFeedbackToDelete(item);
                            setIsDeleteConfirmVisible(true);
                          }}
                          className="p-2.5 rounded-xl transition-all border text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-600 hover:text-white"
                          title="Delete Feedback"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {feedbacks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                            <IoClose className="text-slate-400 text-3xl" />
                          </div>
                          <p className="text-slate-400 font-medium text-lg">
                            No feedbacks found
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
