import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import mediaUpload from "../utils/mediaUpload";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdCameraAlt, MdLock, MdPerson, MdVerified } from "react-icons/md";

export default function UserSettings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    axios
      .get(import.meta.env.VITE_API_URL + "/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  async function updateUserData() {
    try {
      const updatedImage = image ? await mediaUpload(image) : user.image;

      const data = {
        firstName: firstName,
        lastName: lastName,
        image: updatedImage,
      };

      await axios.put(import.meta.env.VITE_API_URL + "/api/users/me", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Profile updated successfully");

      // update local state to reflect changes
      setUser((prev) => ({ ...prev, ...data }));
      setImage(null); // clear selected file
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
    navigate("/");
  }

  // No-ops per your spec (wire your API calls here)
  // async function updateUserData() {
  //     const data = {//yavann lesthi karana data tika
  //         firstName: firstName,
  //         lastName: lastName,
  //         image : user.image
  //     }
  //     if(image !=null){//image ekk thiyenvanm
  //         const link = await mediaUpload(image);//image ek update karala link ek ganna
  //         image.profilePicture = link;
  //     }

  //     await axios.put(import.meta.env.VITE_API_URL + "/api/users/me", data,{
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //     }).then(()=>{
  //         toast.success("Profile updated successfully");
  //     }).catch((err)=>{
  //         console.error("Error updating profile:", err);
  //         toast.error("Failed to update profile");
  //     })
  //     navigate("/")
  // };

  async function updatePassword() {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    await axios
      .put(
        import.meta.env.VITE_API_URL + "/api/users/me/password",
        {
          password: password,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      .then(() => {
        toast.success("Password updated successfully");
        setPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        console.error("Error updating password:", err);
        toast.error("Failed to update password");
      });
    navigate("/");
  }

  const imagePreview = useMemo(
    () => (image ? URL.createObjectURL(image) : ""),
    [image],
  );
  const pwdMismatch =
    password && confirmPassword && password !== confirmPassword;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white border border-bordercolor p-8 rounded-[2.5rem] shadow-sm">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-primary shadow-lg">
            {imagePreview || user?.image ? (
              <img
                src={imagePreview || user?.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary/5 flex items-center justify-center text-secondary/20">
                <MdPerson size={60} />
              </div>
            )}
          </div>
          <label className="absolute inset-0 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <MdCameraAlt className="text-white" size={24} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
            />
          </label>
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-secondary">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-secondary/50 font-medium">
            Manage your public profile and security
          </p>
          <div className="flex gap-2 mt-4 justify-center md:justify-start">
            <span className="px-4 py-1 bg-primary text-secondary text-[10px] font-bold rounded-full uppercase">
              Student
            </span>
            <span className="px-4 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-full uppercase italic flex items-center gap-1">
              <MdVerified /> Verified
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* PERSONAL DETAILS */}
        <div className="bg-white border border-bordercolor p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-3 mb-6 text-accent">
            <MdPerson size={24} />
            <h3 className="text-lg font-black text-secondary">
              Personal Info
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-secondary/40 uppercase ml-1">
                First Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="Alex"
                className="w-full mt-1 p-4 bg-primary rounded-2xl border-none outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium text-secondary"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-secondary/40 uppercase ml-1">
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Doe"
                className="w-full mt-1 p-4 bg-primary rounded-2xl border-none outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium text-secondary"
              />
            </div>
            <button
              onClick={updateUserData}
              className="w-full py-4 bg-accent text-white font-bold rounded-2xl mt-4 hover:shadow-lg hover:shadow-accent/20 transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* PASSWORD SECURITY */}
        <div className="bg-white border border-bordercolor p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-3 mb-6 text-accent">
            <MdLock size={24} />
            <h3 className="text-lg font-black text-secondary">
              Security
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-secondary/40 uppercase ml-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 p-4 bg-primary rounded-2xl border-none outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-secondary/40 uppercase ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full mt-1 p-4 bg-primary rounded-2xl border-none outline-none focus:ring-2 transition-all ${pwdMismatch ? "focus:ring-red-400 ring-2 ring-red-100" : "focus:ring-accent/20"}`}
              />
            </div>
            {pwdMismatch && (
              <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">
                Passwords don't match
              </p>
            )}

            <button
              onClick={updatePassword}
              disabled={!password || !confirmPassword || pwdMismatch}
              className="w-full py-4 bg-secondary text-white font-bold rounded-2xl mt-4 hover:shadow-lg transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
