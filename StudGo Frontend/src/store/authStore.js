import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  accessToken: localStorage.getItem("accessToken") || null,
  currentUser: localStorage.getItem("accessToken") 
    ? jwtDecode(localStorage.getItem("accessToken")) 
    : null,
  apiError: null,
  loading: false,  
  navigate: null, // This will be set by a component

  setNavigate: (navigateFunction) => {
    set({ navigate: navigateFunction });
  },

  handleLogin: async (values) => {
    set({ loading: true, apiError: null });
    try {
      const { data } = await axios.post("https://studgo.runasp.net/api/auth/login", values);
      const token = `bearer ${data.data.accessToken}`;
      const decodedUser = jwtDecode(data.data.accessToken);
      localStorage.setItem("accessToken", token);
      toast.success("Logged in successfully");
      set({ 
        accessToken: token, 
        currentUser: decodedUser, 
        apiError: null,
        loading: false, 
      });

      // Use the navigate function if available, otherwise fall back to window.location
      const { navigate } = get();
      if (navigate) {
        if (decodedUser.role === "Student") {
          navigate("/");
        } else if (decodedUser.role === "StudentActivity") {
          navigate("/student-activity");
        }
      } else {
        if (decodedUser.role === "Student") {
          window.location.href = "/"; 
        } else if (decodedUser.role === "StudentActivity") {
          window.location.href = "/student-activity"; 
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.Errors?.length
        ? error.response.data.Errors.join(", ")
        : error.response?.data?.Message || "An error occurred";

      set({
        accessToken: null,
        currentUser: null,
        apiError: errorMessage,
        loading: false, 
      });
    }
  },

  handleGoogleLogin: async (googleToken) => {
    set({ loading: true, apiError: null });
    try {
      // The token is already a JWT from Google Identity Services
      console.log("Google JWT token:", googleToken.substring(0, 20) + "...");
      
      const { data } = await axios.post(
        "https://studgo.runasp.net/api/auth/google",
        { token: googleToken },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const token = `bearer ${data.data.accessToken}`;
      const decodedUser = jwtDecode(data.data.accessToken);

      localStorage.setItem("accessToken", token);
      toast.success("Logged in successfully with Google");

      set({ 
        accessToken: token, 
        currentUser: decodedUser, 
        apiError: null,
        loading: false, 
      });

      // Use the navigate function if available, otherwise fall back to window.location
      const { navigate } = get();
      if (navigate) {
        if (decodedUser.role === "Student") {
          navigate("/");
        } else if (decodedUser.role === "StudentActivity") {
          navigate("/student-activity");
        }
      } else {
        if (decodedUser.role === "Student") {
          window.location.href = "/"; 
        } else if (decodedUser.role === "StudentActivity") {
          window.location.href = "/student-activity"; 
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.Errors?.length
        ? error.response.data.Errors.join(", ")
        : error.response?.data?.Message || "An error occurred";

      set({
        accessToken: null,
        currentUser: null,
        apiError: errorMessage,
        loading: false, 
      });
    }
  },

  handleLogout: () => {
    localStorage.clear();
    set({ accessToken: null, currentUser: null, apiError: null, loading: false });
  },

  apiRequest: async (endpoint, method = "GET", data = null) => {
    const { accessToken } = get(); // ✅ Get the latest accessToken state

    try {
      const response = await axiosInstance(accessToken)[method.toLowerCase()](endpoint, data);
      return response.data;
    } catch (error) {
      console.error("API Request Error:", error.response);
      throw error.response?.data || error.message;
    }
  },
}));
