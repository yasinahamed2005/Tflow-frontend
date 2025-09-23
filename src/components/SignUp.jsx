import { UserPlus, Mail, Lock } from "lucide-react";
import React, { useState } from "react";
import { Inputwrapper } from "../assets/dummy";
import axios from "axios";

// ✅ Use .env for API URL (fallback to localhost:4000 if not set)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const INITIAL_FORM = { name: "", email: "", password: "" };

const FIELDS = [
  { name: "name", type: "text", placeholder: "Full Name", icon: UserPlus },
  { name: "email", type: "email", placeholder: "Email Address", icon: Mail },
  { name: "password", type: "password", placeholder: "Password", icon: Lock },
];

// ✅ Button styles
const BUTTONCLASSES =
  "w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:from-fuchsia-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed";

// ✅ Message styles
const MESSAGE_SUCCESS =
  "mb-4 p-2 text-sm text-green-700 bg-green-100 border border-green-200 rounded";
const MESSAGE_ERROR =
  "mb-4 p-2 text-sm text-red-700 bg-red-100 border border-red-200 rounded";

const SignUp = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // ✅ Send formData to backend
      const { data } = await axios.post( `${API_URL}/api/user/register`, formData);

      console.log("Signup Successful", data);
      setMessage({
        text: "Registration successful! You can now log in.",
        type: "success",
      });
      setFormData(INITIAL_FORM);
    } catch (err) {
      console.error("Signup error:", err);
      setMessage({
        text:
          err.response?.data?.message ||
          "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">
          Join TaskFlow to manage your tasks
        </p>
      </div>

      {message.text && (
        <div
          className={
            message.type === "success" ? MESSAGE_SUCCESS : MESSAGE_ERROR
          }
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-purple-500 w-5 h-5 mr-2" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
          </div>
        ))}
        <button type="submit" className={BUTTONCLASSES} disabled={loading}>
          {loading ? (
            "Signing Up..."
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Sign Up
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <button
          onClick={onSwitchMode}
          className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignUp;
