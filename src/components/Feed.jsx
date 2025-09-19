import { useState, useEffect } from "react";
import api from "./api.js";
import { Card } from "./Card.jsx";
import { Link } from "react-router-dom";

export function Feed() {
  let [feed, setFeed] = useState([]);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState(null);

  async function search() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/feed");
      setFeed(response.data);
      return response;
    } catch (err) {
      console.error("Error in fetching feed from backend: ", err.message);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="container-fluid py-8">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div
          className=" tryAgain bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
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
      ) : feed.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
            No posts yet!
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Be the first to create a WhatIf scenario or follow more users to see
            their posts.
          </p>
          <Link to="/addNew" className="btn btn-primary">
            Create Your First WhatIf
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:max-w-3xl mx-auto">
          {feed.map((post) => {
            return (
              <Card
                username={post.username}
                prompt={post.prompt}
                response={post.response}
                tone={post.tone}
                type={post.type}
                likeCount={post.likeCount}
                created_at={post.created_at}
                key={post.id}
                userID={post.userID}
                postID={post.id}
                has_Liked={post.has_liked}
                view={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
