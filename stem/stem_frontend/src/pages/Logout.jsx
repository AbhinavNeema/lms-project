import { useEffect } from "react";
import { setToken } from "../apis/axiosInstance";

export default function Logout() {
  useEffect(() => {
    // Clear the JWT token from memory and localStorage
    setToken(null);
    
    // Redirect back to main frontend or home
    const searchParams = new URLSearchParams(window.location.search);
    const returnTo = searchParams.get("returnTo") || import.meta.env.VITE_MAIN_URL || "http://localhost:5173";
    window.location.href = returnTo;
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="font-bold text-lg">Logging out of STEM...</p>
      </div>
    </div>
  );
}
