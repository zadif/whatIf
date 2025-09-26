import { useState, useEffect } from "react";
import { Signup } from "./Signup";
import { Login } from "./Login";
import api from "./api.js";
import { useNavigate } from "react-router-dom";

// Modal component for authentication popups
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export function MainPage() {
  const [activeModal, setActiveModal] = useState(null); // null, 'login', or 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setIsLoggedIn(true);
      navigate("/feed");
    }
  }, [navigate]);

  // Function to close the modal
  const closeModal = () => {
    setActiveModal(null);
  };

  // Function to handle successful login and redirect
  const handleLoginSuccess = () => {
    closeModal();
    navigate("/feed");
  };

  // Function to handle successful signup and show login
  const handleSignupSuccess = () => {
    setActiveModal("login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10">
      <div className="container-fluid">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              Explore Alternate Realities with{" "}
              <span className="text-blue-500">What If</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Create and share fascinating scenarios about how the world would
              be different. What if dinosaurs never went extinct? What if the
              internet was never invented? The possibilities are endless!
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveModal("signup")}
                className="btn btn-primary text-lg px-6 py-3"
              >
                Get Started
              </button>
              <button
                onClick={() => setActiveModal("login")}
                className="btn btn-secondary text-lg px-6 py-3"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative z-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                What If...
              </h3>
              <div className="space-y-4">
                {/* Example WhatIf cards */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    "What if dinosaurs never went extinct?"
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Imagine a world where humans and dinosaurs coexist...
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    "What if the internet was never invented?"
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    How would our society function without digital connectivity?
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    "What if humans could photosynthesize like plants?"
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    A world where food scarcity is solved but with green-skinned
                    humans...
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-200 dark:bg-blue-800/50 rounded-full -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-200 dark:bg-green-800/50 rounded-full -z-10"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Unleash Your Imagination
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover:shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-8 w-8 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2 text-gray-800 dark:text-white">
                Create Scenarios
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Generate fascinating "What If" scenarios in multiple formats:
                news headlines, tweets, articles, and more!
              </p>
            </div>
            <div className="card hover:shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-8 w-8 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2 text-gray-800 dark:text-white">
                Share & Discover
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Share your alternate realities with the community and discover
                creative scenarios from other users.
              </p>
            </div>
            <div className="card hover:shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-8 w-8 text-purple-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2 text-gray-800 dark:text-white">
                Choose Your Tone
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Set the mood with different tones: Mythical, Dark, Scientific,
                Absurd, or Humorous.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Ready to Explore New Realities?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of creative thinkers and explore the infinite
            possibilities of "What If"
          </p>
        </div>
      </div>

      {/* Login Modal */}
      <Modal
        isOpen={activeModal === "login"}
        onClose={closeModal}
        title="Log In"
      >
        <Login
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setActiveModal("signup")}
        />
      </Modal>

      {/* Signup Modal */}
      <Modal
        isOpen={activeModal === "signup"}
        onClose={closeModal}
        title="Create Account"
      >
        <Signup
          onSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setActiveModal("login")}
        />
      </Modal>
    </div>
  );
}

export default MainPage;
