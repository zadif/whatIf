import "./App.css";
import { Header } from "./components/Header";
import { WhatIfs } from "./components/WhatIfs.jsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ErrorPage from "./components/404Error";
import MainPage from "./components/MainPage";
import { Feed } from "./components/Feed.jsx";
import { Profile } from "./components/Profile.jsx";
import { FadeIn } from "./components/animations.jsx";
import { useState, useEffect } from "react";
import api from "./components/api.js";

// This component handles the page transitions
function PageTransition({ children }) {
  return <FadeIn duration={300}>{children}</FadeIn>;
}

// Routes with transitions
function AppRoutes() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    setIsAuthenticated(!!username);
  }, [location]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageTransition>
            <MainPage />
          </PageTransition>
        }
      />
      <Route
        path="addNew"
        element={
          <PageTransition>
            <WhatIfs />
          </PageTransition>
        }
      />
      <Route
        path="feed"
        element={
          <PageTransition>
            <Feed />
          </PageTransition>
        }
      />
      <Route
        path="profile/:name"
        element={
          <PageTransition>
            <Profile />
          </PageTransition>
        }
      />
      <Route
        path="*"
        element={
          <PageTransition>
            <ErrorPage />
          </PageTransition>
        }
      />
    </Routes>
  );
}

function App() {
  let [emailRedirect, setEmailRedirect] = useState(0);
  async function checkEmailRedirect() {
    //if user has been redirected after confiriming his mail
    // he contains access and refresh token
    //So using them to make cookies for them

    try {
      const hash = window.location.hash.slice(1);
      if (!hash) return; // plain URL, skip
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        let response = await api.post("/setCookies", {
          accessToken: access_token,
          refreshToken: refresh_token,
        });
        setEmailRedirect(1);
        // Clean up URL so token isn't visible
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    } catch (err) {
      console.error("Error in email redirect: ", err);
    }
  }

  useEffect(() => {
    checkEmailRedirect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {emailRedirect === 1 ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500 mx-auto mb-4"
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Email Confirmed!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your email has been successfully confirmed. You can now log in to
              your account.
            </p>
            <button
              className="btn btn-primary px-6 py-2"
              onClick={() => {
                setEmailRedirect(0);
                window.location.href = "/";
              }}
            >
              Continue to Login
            </button>
          </div>
        </div>
      ) : (
        <BrowserRouter>
          <Header />
          <main className="pt-4 pb-16">
            <AppRoutes />
          </main>

          {/* Footer */}
          <footer className="py-6 bg-white dark:bg-gray-800 shadow-inner">
            <div className="container-fluid">
              <div className="text-center text-gray-600 dark:text-gray-400">
                <p>
                  &copy; {new Date().getFullYear()} WhatIf - Explore Alternate
                  Realities
                </p>
                <p className="text-sm mt-1">
                  Share your imagination with the world
                </p>
              </div>
            </div>
          </footer>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
