import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(import.meta.env.VITE_API_URL + "/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.role === "admin") {
          toast.error("Admins cannot access user pages");
          navigate("/admin");
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  return <Outlet />;
}