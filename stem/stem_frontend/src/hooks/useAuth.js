import { useState, useEffect, useRef } from "react";
import stemAPI, { setToken, quizApi } from "../apis/axiosInstance";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MAIN_URL = import.meta.env.VITE_MAIN_URL || "http://localhost:5173";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const exchangeAttempted = useRef(false);

  useEffect(() => {
    const authenticate = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      if (code) {
        if (exchangeAttempted.current) return;
        exchangeAttempted.current = true;

        try {
          // Exchange the code for the real JWT token
          const res = await stemAPI.post(
            `${BACKEND_URL}/api/auth/sso-exchange`,
            { code },
          );

          setToken(res.data.token);
          setUser(res.data.user);

          // Clean up the URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } catch (error) {
          console.error("SSO Code exchange failed", error);
          window.location.href = `${MAIN_URL}/login`;
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const res = await stemAPI.get(`${BACKEND_URL}/api/user/currentuser`);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        redirectToMainApp();
      }
    };

    const redirectToMainApp = () => {
      const currentUrl = window.location.href;
      window.location.href = `${MAIN_URL}/sso?returnTo=${encodeURIComponent(currentUrl)}`;
    };

    authenticate();
  }, []);

  return { user, loading };
};

export default useAuth;
