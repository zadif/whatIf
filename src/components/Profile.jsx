import { useState, useEffect } from "react";
import api from "./api.js";
import { Card } from "./Card.jsx";
import { Link, useParams } from "react-router-dom";

export function Profile() {
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts"); // "posts" or "stats"
  let [email, setEmail] = useState("");

  const { name } = useParams();

  async function search() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/self/${name}`);
      setProfile(response.data.data);
      setEmail(response.data.email);
      return response;
    } catch (err) {
      console.error("Error in fetching profile from backend: ", err.message);
      setError("Failed to load your posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="container-fluid py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Profile Avatar */}
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 md:mb-0 md:mr-6">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {name || "Anonymous User"}
            </h1>
            {email && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{email}</p>
            )}

            {/* Profile Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-800 dark:text-white">
                  {profile.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  WhatIfs
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-800 dark:text-white">
                  {profile.reduce(
                    (sum, post) => sum + (post.likeCount || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Likes Received
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Link to="/addNew" className="btn btn-primary">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New WhatIf
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "posts"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          WhatIfs
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={search}
          >
            Try Again
          </button>
        </div>
      ) : profile.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
            You haven't created any WhatIfs yet!
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start by creating your first WhatIf scenario and see where your
            imagination takes you.
          </p>
          <Link to="/addNew" className="btn btn-primary">
            Create Your First WhatIf
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:max-w-3xl mx-auto">
          {profile.map((post) => (
            <Card
              username={name || "You"}
              prompt={post.prompt}
              response={post.response}
              tone={post.tone}
              type={post.type}
              likeCount={post.likeCount}
              created_at={post.created_at}
              key={post.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
