import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "./api";

export function Login({ onSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function submit() {
    // Reset error state
    setError("");

    let popularDomains = [
      "@gmail.com",
      "@yahoo.com",
      "@outlook.com",
      "@hotmail.com",
      "@icloud.com",
      "@aol.com",
      "@protonmail.com",
      "@zoho.com",
      "@yandex.com",
      "@mail.com",
    ];

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!popularDomains.some((domain) => email.endsWith(domain))) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 7) {
      setError("Password should be at least 7 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("username", response.data.username);
      localStorage.setItem("email", response.data.email);

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Fallback to direct navigation if no callback
        navigate("/feed");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status (400, 401, 500…)
        setError(
          error.response.data.error ||
            "Login failed. Please check your credentials."
        );
        console.error("❌ Server error:", error.response.data);
      } else if (error.request) {
        // Request was sent but no response
        setError("No response from server. Please try again later.");
        console.error("❌ No response:", error.request);
      } else {
        // Something else went wrong
        setError("An error occurred. Please try again.");
        console.error("❌ Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle Enter key press to submit when both fields have values
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && email.trim() && password.trim() && !loading) {
      submit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-gray-600 dark:text-gray-300">
          Log in to your WhatIf account
        </p>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter your email"
            className="input"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              className="input pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={loading}
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={submit}
        className="btn btn-primary w-full flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Logging in...
          </>
        ) : (
          "Log In"
        )}
      </button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline focus:outline-none"
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
}
