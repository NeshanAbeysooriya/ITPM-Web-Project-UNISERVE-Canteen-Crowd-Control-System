import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Loder } from "../../components/loder";
import { MdOutlineAdminPanelSettings, MdVerified } from "react-icons/md";

function UserBlockConfirm(props) {
  const email = props.user.email;
  const close = props.close;
  const refresh = props.refresh;

  function blockUser() {
    const token = localStorage.getItem("token");

    axios
      .put(
        import.meta.env.VITE_API_URL + "/api/users/block/" + email,
        {
          isBlock: !props.user.isBlock,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        close();
        toast.success("User block status changed Successfully");
        refresh();
      })
      .catch(() => {
        toast.error("Failed to change user block status");
      });
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center px-4 transition-all">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative p-8 transform transition-all">
        {/* Close button (top-right) */}
        <button
          onClick={close}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full flex justify-center items-center transition-colors"
        >
          <IoClose className="text-xl" />
        </button>

        {/* Dynamic Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center rotate-3 ${props.user.isBlock ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {props.user.isBlock ? <FaLockOpen className="text-3xl -rotate-3" /> : <FaLock className="text-3xl -rotate-3" />}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          {props.user.isBlock ? "Unblock User" : "Block User"}
        </h2>

        {/* Description */}
        <p className="text-center text-gray-500 mb-8 leading-relaxed">
          Are you sure you want to <span className={props.user.isBlock ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{props.user.isBlock ? "Unblock" : "Block"}</span> the user:
          <br />
          <span className="font-medium text-gray-900 mt-1 block px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 inline-block">{email}</span>
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={close}
            className="flex-1 px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={blockUser}
            className={`flex-1 px-6 py-3 rounded-xl font-medium text-white shadow-lg transition-all order-1 sm:order-2 ${
              props.user.isBlock 
              ? "bg-green-600 hover:bg-green-700 shadow-green-200" 
              : "bg-red-600 hover:bg-red-700 shadow-red-200"
            }`}
          >
            {props.user.isBlock ? "Confirm Unblock" : "Confirm Block"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isBlockConfirmVisible, setIsBlockConfirmVisible] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null); //delete karann ona product id ek
  const [isLoading, setIsLoading] = useState(true); //patam ganiddi loading vevi thiyenne e nisa true

  const navigate = useNavigate();

  useEffect(() => {
    //mek run venne page ek mul vathavt load venkot vitrayi

    if (isLoading) {
      //loading vemin thiyenvanm vitrak me ek parak run karann kiyanva
      const token = localStorage.getItem("token");
      if (token == null) {
        toast.error("Please login to access admin panel");
        navigate("/login");
        return;
      }
      axios
        .get(import.meta.env.VITE_API_URL + "/api/users/all-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setUsers(response.data);
          setIsLoading(false); //methan me anvashsha vidiyt 2parak run venva e nisa uda if ek danva
        });
    }
  }, [isLoading]); //array ekt dann puluvam climary variable vitryi, numbers, string, boolean anith evat weda karanne na
  //isLoading ek haddissiye hari venas vunoth me function ek aye run venva

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-[#F8FAFC]">
      {isBlockConfirmVisible && (
        <UserBlockConfirm
          refresh={() => {
            setIsLoading(true);
          }}
          user={userToBlock}
          close={() => {
            setIsBlockConfirmVisible(false);
          }}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 mt-1">Manage permissions, roles, and access for your community.</p>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loder /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Member</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Details</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Role</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.email} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={user.image}
                              referrerPolicy="no-referrer" // google login profile image ek pennanne mehem demmoth vitrayi
                              alt={user.firstName}
                              className={`w-12 h-12 rounded-2xl object-cover ring-2 ring-offset-2 transition-all ${
                                user.isBlock ? "ring-red-500/30" : "ring-green-500/30"
                              }`}
                            />
                            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.isBlock ? "bg-red-500" : "bg-green-500"}`}></span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              {user.email}
                              {user.isEmailVerified && <MdVerified className="text-blue-500" title="Verified" />}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                         <span className="text-sm text-slate-600 font-medium">Active Session</span>
                      </td>

                      {/* ===== ROLE COLOR BADGE ===== */}
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm
                              ${
                                user.role === "admin"
                                  ? "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-600/10"
                                  : "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/10"
                              }`}
                          >
                            {user.role === "admin" && <MdOutlineAdminPanelSettings className="text-sm" />}
                            {user.role.toUpperCase()}
                          </span>
                        </div>
                      </td>

                      {/* ===== BLOCK / UNBLOCK ===== */}
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              setUserToBlock(user); //block userv select karagannva
                              setIsBlockConfirmVisible(true);
                            }}
                            title={user.isBlock ? "Unblock User" : "Block User"}
                            className={`p-2.5 rounded-xl transition-all border ${
                              user.isBlock
                                ? "text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-600 hover:text-white"
                                : "text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-600 hover:text-white"
                            }`}
                          >
                            {user.isBlock ? <FaLockOpen size={18} /> : <FaLock size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                <IoClose className="text-slate-400 text-3xl" />
                            </div>
                            <p className="text-slate-400 font-medium text-lg">No Users to display</p>
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