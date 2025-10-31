// src/pages/auth/Signup.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-48 h-48 bg-pink-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Signup Card */}
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-3">Create Account ✨</h2>
        <p className="text-sm text-center text-gray-200 mb-8">
          Join <span className="font-semibold text-white">TalentFlow</span> and start hiring smarter
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Field */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-300" size={18} />
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none placeholder-gray-300 text-white"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-300" size={18} />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none placeholder-gray-300 text-white"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-300" size={18} />
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none placeholder-gray-300 text-white"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-300 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white py-2 rounded-lg font-semibold shadow-lg transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-200 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;


