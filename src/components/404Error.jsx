import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="container-fluid py-16 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 mb-8 text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
        Page Not Found
      </h2>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
        Oops! It seems this alternate reality doesn't exist yet. Let's get you
        back to a world we know.
      </p>

      <div className="space-x-4">
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>

        <Link to="/feed" className="btn btn-secondary">
          Explore Feed
        </Link>
      </div>
    </div>
  );
}
