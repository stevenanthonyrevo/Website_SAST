/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../main.jsx";
import { BASE_URL } from "../api";

export default function Login() {
  const [method, setMethod] = useState("email"); // email | phone
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  });

  // Email validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Phone validation (basic: 10 digits)
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

  // Handle Login
  const handleLogin = async () => {
    try {
      if (method === "email") {
        if (!isValidEmail(formData.email)) {
          showToast("Please enter a valid email!", "error");
          return;
        }
        if (!formData.password) {
          showToast("Password is required!", "error");
          return;
        }
      } else if (method === "phone") {
        if (!isValidPhone(formData.phone)) {
          showToast("Please enter a valid 10-digit phone number!", "error");
          return;
        }
        if (!formData.password) {
          showToast("Password is required!", "error");
          return;
        }
      }

      setLoader(true);

      const payload =
        method === "email"
          ? { email: formData.email.trim(), password: formData.password }
          : { phone: formData.phone.trim(), password: formData.password };

      const res = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.token) {
        showToast("Login successful!", "success");
        localStorage.setItem("token", result.token);
        navigate("/");
      } else {
        showToast(result.message || "Invalid credentials", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error. Try again.", "error");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes subtle-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
          }
        }

        .space-bg {
          background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
          position: relative;
          overflow: hidden;
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .star {
          position: absolute;
          width: 1px;
          height: 1px;
          background: white;
          border-radius: 50%;
          opacity: 0.6;
        }

        .neon-border {
          border: 2px solid rgba(0, 255, 255, 0.6);
          animation: subtle-glow 3s ease-in-out infinite;
        }

        .glass-effect {
          background: rgba(17, 25, 40, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <Navbar />
      <div className="min-h-screen flex justify-center items-center space-bg p-4 transition-colors duration-300">
        {/* Stars Background */}
        <div className="stars">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-md glass-effect neon-border shadow-2xl rounded-2xl p-8 z-10 relative">
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Login
          </h2>

          {/* Switch between Email / Phone */}
          <div className="flex mb-6 bg-gray-900/50 rounded-lg p-1 border border-cyan-500/30">
            <button
              onClick={() => setMethod("email")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                method === "email"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                  : "text-gray-300 hover:bg-gray-800/50"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => 
                showToast("Phone login is not implemented yet.", "error")
              }
              className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${
                method === "phone"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                  : "text-gray-300 hover:bg-gray-800/50"
              }`}
            >
              Phone
            </button>
          </div>

          {/* Email Login */}
          {method === "email" && (
            <>
              <input
                type="email"
                className="w-full p-3 border border-cyan-500/50 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </>
          )}

          {/* Phone Login */}
          {method === "phone" && (
            <>
              <input
                type="text"
                className="w-full p-3 border border-cyan-500/50 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </>
          )}

          {/* Password Input */}
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 border border-cyan-500/50 rounded-lg bg-gray-900/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-cyan-400 hover:text-cyan-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-cyan-500/50 transition-all duration-300"
            onClick={handleLogin}
            disabled={loader}
          >
            {loader ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{" "}
            <a
              onClick={() => navigate("/register")}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              <span className="hover:text-cyan-300 hover:underline">
                Register
              </span>
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}