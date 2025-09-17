import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "./api.js";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const username = localStorage.getItem("username");
    setIsLoggedIn(!!username);
  }, [location]);

  const handleLogout = async () => {
    try {
      await api.get("/logout");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      setIsLoggedIn(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container-fluid flex justify-between items-center py-4">
        {/* Logo */}
        <Link
          to="/"
          className="kaushan-script-regular text-3xl text-blue-500 hover:text-blue-600 transition-colors"
        >
          What If
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link
                to="/feed"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
              >
                Feed
              </Link>
              <Link
                to="/addNew"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
              >
                Create
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
              >
                Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <></>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 py-4 px-6 shadow-inner">
          <nav className="flex flex-col space-y-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/feed"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Feed
                </Link>
                <Link
                  to="/addNew"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-secondary w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <></>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
