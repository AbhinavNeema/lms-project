// src/pages/SsoRedirect.jsx
import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App"; 

const SsoRedirect = () => {
  useEffect(() => {
    const handleSSO = async () => {
      // Check where the Stem app wants us to return the user
      const searchParams = new URLSearchParams(window.location.search);
      const returnTo = searchParams.get("returnTo");

      if (!returnTo) {
        window.location.href = "/";
        return;
      }

      try {
        //  Ask the backend for a one-time SSO code.
        const res = await axios.get(`${serverUrl}/api/auth/sso-code`);

        const { code } = res.data;

        // Send the user back to the Stem app with the code in the URL
        window.location.href = `${returnTo}?code=${code}`;
      } catch (error) {
        // If this fails (e.g., cookie expired), send them to the normal login
        console.log("Not authenticated for SSO, redirecting to login");
        window.location.href = "/login";
      }
    };

    handleSSO();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f8fafc]">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold text-slate-800">
        Authenticating securely...
      </h2>
      <p className="text-slate-500">Transferring you to the STEM Arena</p>
    </div>
  );
};

export default SsoRedirect;
