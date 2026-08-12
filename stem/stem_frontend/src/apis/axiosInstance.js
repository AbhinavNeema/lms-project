import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MAIN_URL = import.meta.env.VITE_MAIN_URL || "http://localhost:5173"; 


let inMemoryToken = localStorage.getItem("stem_token") || null;

export const setToken = (token) => {
  inMemoryToken = token;
  if (token) {
    localStorage.setItem("stem_token", token);
  } else {
    localStorage.removeItem("stem_token");
  }
};

const stemAPI = axios.create({
  baseURL: `${BACKEND_URL}/api/stem`,
});

export const quizApi = axios.create({
  baseURL: `${BACKEND_URL}/api/stem/quiz`,
});

// Add the interceptor to attach the token to every request
stemAPI.interceptors.request.use((config) => {
  if (inMemoryToken) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }
  return config;
});

quizApi.interceptors.request.use((config) => {
  if (inMemoryToken) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }
  return config;
});

// Response interceptor to clear token on 401 Unauthorized
const handleUnauthorized = (error) => {
  if (error.response && error.response.status === 401) {
    setToken(null);

    window.location.href = `${MAIN_URL}/login`;
  }
  return Promise.reject(error);
};

stemAPI.interceptors.response.use(
  (response) => response,
  handleUnauthorized
);

quizApi.interceptors.response.use(
  (response) => response,
  handleUnauthorized
);

export default stemAPI;
