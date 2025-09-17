import { useState, useCallback, useMemo } from "react";
import axios from "axios";
import { generateUsername } from "unique-username-generator";
import { useNavigate } from "react-router-dom";

export function Signup({ onSuccess }) {
  // Generate username only once when component mounts
  const initialUsername = useMemo(() => generateUsername(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(initialUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function submit() {
    // Reset states
    setError("");
    setSuccess(false);

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

    if (!email || !password || !username) {
      setError("Please fill in all fields");
      return;
    }

    if (!popularDomains.some((domain) => email.endsWith(domain))) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 7) {
      setError("Password must be at least 7 characters long");
      return;
    }

    let hasUpperCase = /[A-Z]/.test(password);
    let hasNumber = /[0-9]/.test(password);
    let hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUpperCase && hasNumber && hasSpecialChar)) {
      setError(
        "Password must contain at least one uppercase letter, one number, and one special character"
      );
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError(
        "Username can only contain letters, numbers, underscores, and hyphens"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/signup", {
        email: email,
        password: password,
        username: username,
      });

      setSuccess(true);

      // After a successful signup, wait briefly and then call onSuccess
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 3000);
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.error || "Signup failed. Please try again."
        );
        // Remove console.error for better performance
      } else if (error.request) {
        setError("No response from server. Please try again later.");
        // Remove console.error for better performance
      } else {
        setError("An error occurred. Please try again.");
        // Remove console.error for better performance
      }
    } finally {
      setLoading(false);
    }
  }

  function reloadUsername() {
    setUsername(generateUsername());
  }

  // Memoized event handlers to prevent recreation on each render
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-gray-600 dark:text-gray-300">
          Join the WhatIf community today
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

      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">
            Account created successfully! Go and verify your email first...
          </span>
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
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="input"
            disabled={loading || success}
          />
          <p className="text-xs text-gray-500 mt-1">
            We'll never share your email with anyone else.
          </p>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Create a strong password"
            className="input"
            disabled={loading || success}
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 7 characters with uppercase, number, and special
            character.
          </p>
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Username
          </label>
          <div className="flex gap-2">
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Choose a username"
              className="input flex-1"
              disabled={loading || success}
            />
            <button
              onClick={reloadUsername}
              className="btn btn-secondary"
              disabled={loading || success}
              title="Generate a random username"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={submit}
        className="btn btn-primary w-full flex items-center justify-center"
        disabled={loading || success}
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
            Creating Account...
          </>
        ) : success ? (
          <>
            <svg
              className="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Success!
          </>
        ) : (
          "Sign Up"
        )}
      </button>
    </div>
  );
}
